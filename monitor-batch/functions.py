# -*- coding: utf-8 -*-
"""
用于全局函数设置
"""
## 加载python模块
import os,sys,time,datetime
import json,yaml,logging,io
import pymysql

## 禁止脚本本地运行
if __name__ == '__main__':
    print(__doc__)
    sys.exit(0)

## 获取根目录，并添加到全局路径变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局配置文件中调用相关变量
from config import mysql_conn, logFormat

## 指定日志格式
logFormat

## 获取当前月之前一年月份列表(不包含当前月)
def pre_twelve_month():
    _nowMon       = datetime.datetime.now().month
    _nowYear      = datetime.datetime.now().year
    _sumMon       = _nowYear * 12 + _nowMon
    _monList      = [ (x // 12, x%12 + 1) for x in range(_sumMon - 12 - 1, _sumMon) ]
    _monUtimeList = [ int(time.mktime(datetime.date(x[0],x[1],1).timetuple())) for x  in _monList ]
    _outputList   = [ (_monUtimeList[x], _monUtimeList[x+1]) for x in range(len(_monUtimeList)-1) ]
    return _outputList

## 获取yaml文件数据，并转置为数组形式
def load_yaml_file(_fileName):
    _file = open(_fileName, 'r', encoding = 'utf-8')
    _dict = yaml.load(_file, Loader = yaml.FullLoader)
    return _dict

## 获取json文件数据，并转置为数组形式
def load_json_file(_fileName):
    _file = io.open(_fileName, 'rt', encoding = 'utf-8').read()
    _dict = json.loads(_file)
    return _dict

## 数据库(mysql)查询函数
def mysql_query(**kwargs):
    _cmd      = kwargs.get('cmd')
    _host     = kwargs.get('host')
    _user     = kwargs.get('user')
    _passwd   = kwargs.get('passwd')
    _port     = kwargs.get('port')
    _fetchone = kwargs.get('fetchone')
    _charset  = 'utf8'

    try:
        _db = pymysql.connect(
            host        = _host,
            user        = _user,
            passwd      = _passwd,
            port        = _port,
            charset     = _charset,
            cursorclass = pymysql.cursors.DictCursor
    )
    except Exception as e:
        logging.error("查询数据库连接失败: host={}, user={}, passwd='*******', port={}. ".format(
                       _host, _user, _port), e)
    else:
        _cursor = _db.cursor()
        try:
            _cursor.execute(_cmd)
        except Exception as e:
            logging.error("查询命令{}执行失败: ".format(_cmd), e)
        else:
            if _fetchone:
                _result = _cursor.fetchone()
            else:
                _result = _cursor.fetchall()
            _cursor.close()

        _db.close()

    return _result


## 数据库(mysql)修改函数
def mysql_modify(**kwargs):
    _cmd     = kwargs.get('cmd')
    _host    = kwargs.get('host')
    _user    = kwargs.get('user')
    _passwd  = kwargs.get('passwd')
    _port    = kwargs.get('port')
    _charset = 'utf8'

    try:
        _db = pymysql.connect(
            host    = _host,
            user    = _user,
            passwd  = _passwd,
            port    = _port,
            charset = _charset
        )
    except Exception as e:
        logging.error("变更数据库连接失败: host={},user={},passwd='*******',port={}. ".format(
                       _host, _user, _port), e)
    else:
        _cursor = _db.cursor()
        try:
            _cursor.execute(_cmd)
        except Exception as e:
            _db.rollback()
            logging.error("变更命令{}执行失败: ".format(_cmd),e)
        else:
            _db.commit()
            _result = _cursor.fetchone()
            _cursor.close()
        _db.close()

    return _result

## 数据库变更函数(根据查询结果判断自动插入或者修改数据) 
def mysql_update(**kwargs):
    _host     = kwargs.get('host')
    _user     = kwargs.get('user')
    _passwd   = kwargs.get('passwd')
    _port     = kwargs.get('port')
    _db       = kwargs.get('db')
    _tb       = kwargs.get('tb')
    _name     = kwargs.get('name')
    _data     = kwargs.get('data')
    _unixTime = kwargs.get('unixTime')

    ## 查询语句
    _sltCmd = mysql_conn.sltSQL.format(_db, _tb, _name)
    ## 插入语句
    _istCmd = mysql_conn.istSQL.format(_db, _tb, _name, _data, _unixTime)
    ## 更新语句
    _uptCmd = mysql_conn.uptSQL.format(_db, _tb, _data, _unixTime, _name)

    ## 查询数据
    _sltRe = mysql_query(
        cmd    = _sltCmd,
        host   = _host, 
        user   = _user, 
        passwd = _passwd, 
        port   = _port, 
        db     = _db
    )

    ## 根据查询值判断执行语句
    if _sltRe:
        ## 修改数据
        _cmd = _uptCmd
    else:
        ## 插入数据
        _cmd = _istCmd

    ## 执行上述命令完成数据库变更操作
    mysql_modify(
        cmd    = _cmd,
        host   = _host, 
        user   = _user, 
        passwd = _passwd, 
        port   = _port, 
        db     = _db
    )
