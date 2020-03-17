# -*- coding: utf-8 -*-
"""
用于全局函数设置
"""
## 加载模块
import os,sys,time,datetime
import json,yaml,logging,io
import pymysql

## 该脚本只能调用
if __name__ == '__main__':
    print(__doc__)
    sys.exit(0)

## 全局变量
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局配置文件中引用相应数据
from config import mysql_conn,logFormat

## 调用日志格式
logFormat

## 之前一年的月份列表
def pre_twelve_month():
    _nowMon   = datetime.datetime.now().month
    _nowYear  = datetime.datetime.now().year
    _sumMon=_nowYear*12+_nowMon
    _monList=[(x//12,x%12+1) for x in range(_sumMon-12-1,_sumMon)]
    _monUtimeList=[int(time.mktime(datetime.date(x[0],x[1],1).timetuple())) for x  in _monList]
    _outputList=[(_monUtimeList[x],_monUtimeList[x+1]) for x in range(len(_monUtimeList)-1)]
    return _outputList

## yaml文件转数组
def load_yaml_file(_fileName):
    _file=open(_fileName,'r',encoding='utf-8')
    _dict=yaml.load(_file,Loader=yaml.FullLoader)
    return _dict

## json文件转数组
def load_json_file(_fileName):
    _file=io.open(_fileName,'rt',encoding='utf-8').read()
    _dict=json.loads(_file)
    return _dict

# 用于mysql查询
def mysql_query(**kwargs):
    _cmd     = kwargs.get('cmd')
    _host    = kwargs.get('host')
    _user    = kwargs.get('user')
    _passwd  = kwargs.get('passwd')
    _port    = kwargs.get('port')
    _charset = 'utf8'

    try:
        _db = pymysql.connect(
            host=_host,
            user=_user,
            passwd=_passwd,
            port=_port,
            charset=_charset,
            cursorclass = pymysql.cursors.DictCursor
    )
    except Exception as e:
        logging.error("查询数据库连接失败: host={},user={},passwd='*******',port={}. ".format(
                       _host,_user,_port),e)
    else:
        _cursor = _db.cursor()
        _sql    = _cmd
        try:
            _cursor.execute(_sql)
        except Exception as e:
            logging.error("查询命令{}执行失败: ".format(_cmd),e)
        else:
            _result = _cursor.fetchall()
            _re     = _result
            _cursor.close()
        _db.close()
    return _re


## 用于mysql修改
def mysql_modify(**kwargs):
    _cmd     = kwargs.get('cmd')
    _host    = kwargs.get('host')
    _user    = kwargs.get('user')
    _passwd  = kwargs.get('passwd')
    _port    = kwargs.get('port')
    _charset = 'utf8'

    try:
        _db  = pymysql.connect(host=_host,user=_user,passwd=_passwd,port=_port,charset=_charset)
    except Exception as e:
        logging.error("变更数据库连接失败: host={},user={},passwd='*******',port={}. ".format(
                       _host,_user,_port),e)
    else:
        _cursor = _db.cursor()
        _sql    = _cmd
        try:
            _cursor.execute(_sql)
        except Exception as e:
            _db.rollback()
            logging.error("变更命令{}执行失败: ".format(_cmd),e)
        else:
            _db.commit()
            _result = _cursor.fetchall()
            _re     = _result
            _cursor.close()
        _db.close()

## 用于mysql更新数据，包含插入和修改，自动识别。
def mysql_update(**kwargs):
    _host=kwargs.get('host')
    _user=kwargs.get('user')
    _passwd=kwargs.get('passwd')
    _port=kwargs.get('port')
    _db=kwargs.get('db')
    _tb=kwargs.get('tb')

    _name=kwargs.get('name')
    _data=kwargs.get('data')
    _unixTime=kwargs.get('unixTime')

    ## 查询语句
    _sltCmd=mysql_conn.sltSQL.format(_db,_tb,_name)
    ## 插入语句
    _istCmd=mysql_conn.istSQL.format(_db,_tb,_name,_data,_unixTime)
    ## 更新语句
    _uptCmd=mysql_conn.uptSQL.format(_db,_tb,_data,_unixTime,_name)

    ## 查询结果是否存在
    _sltRe=mysql_query(
        cmd=_sltCmd,
        host=_host, 
        user=_user, 
        passwd=_passwd, 
        port=_port, 
        db=_db
    )

    ## 根据查询结果判断执行命令
    if _sltRe:
        ## 修改数据
        _cmd=_uptCmd
    else:
        ## 插入数据
        _cmd=_istCmd

    ## 更新数据
    mysql_modify(
        cmd=_cmd,
        host=_host, 
        user=_user, 
        passwd=_passwd, 
        port=_port, 
        db=_db
    )
