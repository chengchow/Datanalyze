# -*- coding: utf-8 -*-
"""
全局函数
"""

## 调用python模块
import os,sys
import yaml,io,json
import logging
import pymysql

## 禁止脚本本地运行
if __name__ == '__main__':
    print(__doc__)
    sys.exit(0)

## 从全局配置文件中引用变量
from config import mysql_conn, logFormat

## 获取根目录, bin添加到全局变量路径中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 指定日志格式
logFormat

## yaml文件转数组函数
def load_yaml_file(_fileName):
    _file = open(_fileName, 'r', encoding = 'utf-8')
    _dict = yaml.load(_file, Loader = yaml.FullLoader)
    return _dict

## json文件转数组函数
def load_json_file(_fileName):
    _file = io.open(_fileName, 'rt', encoding = 'utf-8').read()
    _dict = json.loads(_file)
    return _dict

##列表去重不排序
def list_uniq (_list):
    from functools import reduce
    func = lambda x,y:x if y in x else x + [y]
    return reduce(func, [[], ] + _list)

##列表去重排序
def list_sort(_list):
    return list(set(_list))

# mysql查询
def mysql_query(**kwargs):
    _cmd      = kwargs.get('cmd')
    _host     = kwargs.get('host')
    _user     = kwargs.get('user')
    _passwd   = kwargs.get('passwd')
    _port     = kwargs.get('port')
    _db       = kwargs.get('db')
    _charset  = kwargs.get('charset')
    _fetchone = kwargs.get('fetchone')

    try:
        _db = pymysql.connect(
            host        = _host,
            user        = _user,
            passwd      = _passwd,
            port        = _port,
            db          = _db,
            charset     = _charset,
            cursorclass = pymysql.cursors.DictCursor
        )
    except Exception as e:
        logging.error("DB 连接失败: host={},user={},passwd='*******',port={},db={},".format(
                       _host, _user, _port, _db), e)
    else:
        _cursor = _db.cursor()
        try:
            _cursor.execute(_cmd)
        except Exception as e:
            logging.error("SQL: {} 执行失败: ".format(_cmd), e)
        else:
            if _fetchone:
                _result = _cursor.fetchone()
            else:
                _result = _cursor.fetchall()

            _cursor.close()

        _db.close()

    return _result
