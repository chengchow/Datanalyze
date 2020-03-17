# -*- coding: utf-8 -*-
"""
定时处理hive数据，结果输出到mysql
"""

## 添加全局变量及函数
import os,sys
import logging
from flask import Flask

## 全局环境变量
nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=nowPath
sys.path.append(homePath)

## 引入全局变量
import config
from config import appPath,logFormat,mysql_conn
sys.path.append(appPath)

## 引入全局函数
from functions import mysql_query

## 调用日志格式
logFormat

app=Flask(__name__)

@app.route("/monitor/json/hostmap")
def hostmap_mod():
    label=config.hostmap.label
    dataList=mysql_query(
        cmd=mysql_conn.sltSQL.format(label),
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        charset='utf8'
    )

    return dataList[0].get('data')

@app.route("/monitor/json/event")
def event_mod():
    label=config.event.label
    dataList=mysql_query(
        cmd=mysql_conn.sltSQL.format(label),
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        charset='utf8'
    )

    return dataList[0].get('data')

@app.route("/monitor/json/loadavg")
def loadavg_mod():
    label=config.loadavg.label
    dataList=mysql_query(
        cmd=mysql_conn.sltSQL.format(label),
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        charset='utf8'
    )

    return dataList[0].get('data')

@app.route("/monitor/json/port")
def port_mod():
    label=config.port.label
    dataList=mysql_query(
        cmd=mysql_conn.sltSQL.format(label),
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        charset='utf8'
    )

    return dataList[0].get('data')

@app.route("/monitor/json/disk")
def disk_mod():
    label=config.disk.label
    dataList=mysql_query(
        cmd=mysql_conn.sltSQL.format(label),
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        charset='utf8'
    )

    return dataList[0].get('data')

@app.route("/monitor/json/nowport")
def nowport_mod():
    label=config.nowport.label
    dataList=mysql_query(
        cmd=mysql_conn.sltSQL.format(label),
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        charset='utf8'
    )

    return dataList[0].get('data')

@app.route("/monitor/json/nowevent")
def nowevent_mod():
    label=config.nowevent.label
    dataList=mysql_query(
        cmd=mysql_conn.sltSQL.format(label),
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        charset='utf8'
    )

    return dataList[0].get('data')

@app.route("/monitor/json/port10")
def port10_mod():
    label=config.port10.label
    dataList=mysql_query(
        cmd=mysql_conn.sltSQL.format(label),
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        charset='utf8'
    )

    return dataList[0].get('data')

@app.route("/monitor/json/nowport10")
def nowport10_mod():
    label=config.nowport10.label
    dataList=mysql_query(
        cmd=mysql_conn.sltSQL.format(label),
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        charset='utf8'
    )

    return dataList[0].get('data')


## 运行
if __name__ == '__main__':
#    app.run(debug=False)
    app.run(debug=True, port=10222, host='192.168.254.20')
