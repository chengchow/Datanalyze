# -*- coding: utf-8 -*-
"""
定时处理hive数据，结果输出到mysql
"""

## 调用python模块
import os, sys
import logging
from flask import Flask

## 获取根目录, 并添加到全局环境路径变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = nowPath
sys.path.append(homePath)

## 引入全局变量, 并从全局变量中引入变量
import config
from config import appPath,logFormat,mysql_conn

## 添加app路径到全局变量路径中
sys.path.append(appPath)

## 从全局函数文件中引用相应函数
from functions import mysql_query

## 指定日志格式
logFormat

## 指定装饰器
app=Flask(__name__)

## hostmap路由
@app.route("/monitor/json/hostmap")
def hostmap_mod():
    label = config.hostmap.label
    dataDict = mysql_query(
        cmd      = mysql_conn.sltSQL.format(label),
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    return dataDict.get('data')

## event路由
@app.route("/monitor/json/event")
def event_mod():
    label = config.event.label
    dataDict = mysql_query(
        cmd      = mysql_conn.sltSQL.format(label),
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    return dataDict.get('data')

## loadavg路由
@app.route("/monitor/json/loadavg")
def loadavg_mod():
    label = config.loadavg.label
    dataDict = mysql_query(
        cmd      = mysql_conn.sltSQL.format(label),
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    return dataDict.get('data')

## port路由
@app.route("/monitor/json/port")
def port_mod():
    label = config.port.label
    dataDict = mysql_query(
        cmd      = mysql_conn.sltSQL.format(label),
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    return dataDict.get('data')

## disk路由
@app.route("/monitor/json/disk")
def disk_mod():
    label = config.disk.label
    dataDict = mysql_query(
        cmd      = mysql_conn.sltSQL.format(label),
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    return dataDict.get('data')

## nowport路由
@app.route("/monitor/json/nowport")
def nowport_mod():
    label = config.nowport.label
    dataDict = mysql_query(
        cmd      = mysql_conn.sltSQL.format(label),
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    return dataDict.get('data')

## nowevent路由
@app.route("/monitor/json/nowevent")
def nowevent_mod():
    label = config.nowevent.label
    dataDict = mysql_query(
        cmd      = mysql_conn.sltSQL.format(label),
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    return dataDict.get('data')

## port10路由
@app.route("/monitor/json/port10")
def port10_mod():
    label = config.port10.label
    dataDict = mysql_query(
        cmd      = mysql_conn.sltSQL.format(label),
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    return dataDict.get('data')

## nowport10路由
@app.route("/monitor/json/nowport10")
def nowport10_mod():
    label = config.nowport10.label
    dataDict = mysql_query(
        cmd      = mysql_conn.sltSQL.format(label),
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    return dataDict.get('data')

## 运行
if __name__ == '__main__':
#    app.run(debug=False)
    app.run(debug=True, port=10222, host='192.168.254.20')
