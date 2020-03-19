# -*- coding: utf-8 -*-
"""
用于全局函数设置
"""
## 加载 python 模块
import os,sys,time
import json,requests,logging
import pymysql

## 设置脚本只允许调用
if __name__ == '__main__':
    print(__doc__)
    sys.exit(0)

## 获取根路径, 并添加到全局路径中. 
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局配置文件中调用相应变量
from config import queryUrl,headersUserAgent,mysql_conn,logFormat

## 指定日志格式
logFormat

## 爬取数据函数(国家统计局官网)
def get_data(**kwargs):
    headers  = {}
    keyValue = {}

    url                   = kwargs.get('Url')              or queryUrl
    headers['User-Agent'] = kwargs.get('headersUserAgent') or headersUserAgent
    keyValue['m']         = kwargs.get('m')                or 'QueryData'
    keyValue['rowcode']   = kwargs.get('rowCode')          or 'zb'
    keyValue['colcode']   = kwargs.get('colCode')          or 'sj'
    keyValue['wds']       = kwargs.get('wds')              or None
    keyValue['dbcode']    = kwargs.get('dbCode')           or 'hgnd'
    keyValue['dfwds']     = kwargs.get('dfwds')            or None
    keyValue['k1']        = str(int(round(time.time()*1000)))

    result = requests.get(
        url,
        headers = headers,
        params  = keyValue
    )

    return json.loads(result.text)

# 数据库(mysql)查询函数
def mysql_query(**kwargs):
    _cmd      = kwargs.get('cmd')
    _host     = kwargs.get('host')   or mysql_conn.host
    _user     = kwargs.get('user')   or mysql_conn.user
    _passwd   = kwargs.get('passwd') or mysql_conn.passwd
    _port     = kwargs.get('port')   or mysql_conn.port
    _db       = kwargs.get('db')     or mysql_conn.db
    _charset  = 'utf8'
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
        logging.error("数据库连接失败: host={},user={},passwd='*******',port={},db={},".format(
                       _host,_user,_port,_db),e)
    else:
        _cursor = _db.cursor()
        try:
            _cursor.execute(_cmd)
        except Exception as e:
            logging.error("命令{}执行失败: ".format(_cmd),e)
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
    _host    = kwargs.get('host') or mysql_conn.host
    _user    = kwargs.get('user') or mysql_conn.user
    _passwd  = kwargs.get('passwd') or mysql_conn.passwd
    _port    = kwargs.get('port') or mysql_conn.port
    _db      = kwargs.get('db') or mysql_conn.db
    _charset = 'utf8'

    try:
        _db = pymysql.connect(
            host    = _host,
            user    = _user,
            passwd  = _passwd,
            port    = _port,
            db      = _db,
            charset = _charset
        )
    except Exception as e:
        logging.error("数据库连接失败: host={},user={},passwd='*******',port={},db={},".format(
                       _host,_user,_port,_db),e)
    else:
        _cursor = _db.cursor()
        try:
            _cursor.execute(_cmd)
        except Exception as e:
            logging.error("命令执行失败: {}".format(_cmd),e)
            logging.warning("开始回滚: {}".format(_cmd))
            _db.rollback()
        else:
            _db.commit()
            _result = _cursor.fetchone()
            _cursor.close()

        _db.close()

    return _result

## 数据库变更函数(根据查询结果判断自动插入或者修改数据)
def mysql_update(**kwargs):
    _host     = kwargs.get('host')   or mysql_conn.host
    _user     = kwargs.get('user')   or mysql_conn.user
    _passwd   = kwargs.get('passwd') or mysql_conn.passwd
    _port     = kwargs.get('port')   or mysql_conn.port
    _db       = kwargs.get('db')     or mysql_conn.db
    _table    = kwargs.get('table')  or mysql_conn.tb
    _code     = kwargs.get('code')
    _value    = kwargs.get('value')
    _wds      = kwargs.get('wds')
    _year     = kwargs.get('year')
    _unixTime = kwargs.get('unixTime')

    ## 查询语句
    _sltCmd = "SELECT code FROM {} WHERE code='{}'".format(
             _table, _code)
    ## 插入语句
    _istCmd = "INSERT INTO {} values ('{}',{},'{}',{},{})".format(
             _table, _code, _value, _wds, _year, _unixTime)
    ## 更新语句
    _uptCmd = "UPDATE {} SET value={}, wds='{}', year={}, unixtime={} WHERE code='{}'".format(
             _table, _value, _wds, _year, _unixTime, _code)

    ## 查询结果是否存在
    _sltRe = mysql_query(
        cmd    = _sltCmd,
        host   = _host, 
        user   = _user, 
        passwd = _passwd, 
        port   = _port, 
        db     = _db
    )

    ## 根据查询结果判断执行命令
    if _sltRe:
        ## 修改数据
        _cmd = _uptCmd
    else:
        ## 插入数据
        _cmd = _istCmd

    ## 更新数据
    mysql_modify(
        cmd    = _cmd,
        host   = _host, 
        user   = _user, 
        passwd = _passwd, 
        port   = _port, 
        db     = _db
    )
