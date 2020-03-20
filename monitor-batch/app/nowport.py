# -*- coding: utf-8 -*-
"""
当月端口触发超时时间比例图
"""

## 调用python模块
import os, sys
import json
import datetime,time

## 获取根目录, 并添加到全局环境变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量文件中引用相应变量
from config import nowport, zbxdb_conn, mysql_conn

## 从全局函数文件中引用相应函数
from functions import load_yaml_file, pre_twelve_month, mysql_query, mysql_update

## 从yaml文件中获取数据, 并转置为数组
yamlFile = nowport.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 结果查询, 从数据库中
def data_query(_sql):
    _resultList = mysql_query(
        cmd      = _sql,
        host     = zbxdb_conn.host,
        user     = zbxdb_conn.user,
        passwd   = zbxdb_conn.passwd,
        port     = zbxdb_conn.port,
        fetchone = 1,
        charset  = 'utf8'
    )

    ## 返回结果
    _result = _resultList.get('result')
    return _result

## 查询当前月数据
def data_list(_dict, _clockList, _divUnit):
    _db       = zbxdb_conn.db
    _tb       = zbxdb_conn.tb
    _querySQL = nowport.querySQL
    _nowMonTime= max(max(x) for x in _clockList)

    if isinstance(_dict.get('severity'), int):
        _logic    = "="
        _severity = _dict.get('severity')
    elif isinstance(_dict.get('severity'), list):
        _logic    = "IN"
        _severity = tuple(_dict.get('severity'))

    _data =data_query(_querySQL.format(
        _db, _tb, _logic, _severity, _nowMonTime, _dict.get('filter'))) / _divUnit

    return _data

## 主程序
def main():
    ## 从yaml列表中获取数据
    textTagList = yamlDict.get('textTagList')
    legendList  = [ x.get('name') for x in textTagList ]
    colorList   = yamlDict.get('colorList')
    titleName   = yamlDict.get('titleName')
    yUnit       = yamlDict.get('yUnit')
    divUnit     = yamlDict.get('divUnit') or 1

    ## 获取之前一年的月份列表
    clockList = pre_twelve_month()

    ## 生成X轴刻度列表
    dataList=[
        {
            'name': x.get('name'),
            'value':data_list(x,clockList,divUnit)
        }
        for x in textTagList
    ]

    ## 生成输出字典
    outputDict = {
        'title' : titleName,
        'label' : legendList,
        'color' : colorList,
        'data'  : dataList
    }

    ## 输出字典转字符串
    outputStr = json.dumps(
        outputDict,
        ensure_ascii = False
    )

    ## 存储结果到mysql数据库
    mysql_update(
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        db       = mysql_conn.db,
        tb       = mysql_conn.tb,
        name     = nowport.label,
        data     = outputStr,
        unixTime = int(time.time())
    )

## 调试
if __name__ == '__main__':
    main()
