# -*- coding: utf-8 -*-
"""
当月端口触发前十示意图
"""

## 调用python模块
import os,sys
import json
import datetime,time

## 获取根目录, 并添加到全局环境变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量文件中引用相应变量
from config import nowport10, zbxdb_conn, mysql_conn

## 从全局函数文件中引用相应函数
from functions import load_yaml_file, pre_twelve_month, mysql_query, mysql_update

## 从yaml文件中获取数据, 并转置为数组
yamlFile = nowport10.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 结果查询, 从数据库中
def data_query(_sql):
    _resultList = mysql_query(
        cmd     = _sql,
        host    = zbxdb_conn.host,
        user    = zbxdb_conn.user,
        passwd  = zbxdb_conn.passwd,
        port    = zbxdb_conn.port,
        charset = 'utf8'
    )

    ## 数据处理, 主要是将名称简化并并规范
    _dataList = [
        {
            'name': '_'.join(x.get('name').split()[1:-2]),
            'value': x.get('result')
        }
        for x in _resultList
    ]

    return _dataList

## 生成阴影列表
def stealth_list(_list):
    _resultList = [
        {
           'name'      : '',
           'value'     : x.get('value'),
           'itemStyle' : {'color': 'transparent'},
           'label'     : {'show':'false'},
           'labelLine' : {'show':'false'}
        }
        for x in _list
    ]

    return _resultList

## 主程序
def main():
    ## 从yaml列表中获取数据
    filterKey = yamlDict.get('filter')
    colorList = yamlDict.get('colorList')
    titleName = yamlDict.get('titleName')
    yUnit     = yamlDict.get('yUnit')
    divUnit   = yamlDict.get('divUnit') or 1

    ## 取出本月开始时间
    clockList  = pre_twelve_month()
    startUtime = max(max(x) for x in clockList)

    ## mysql连接信息
    db       = zbxdb_conn.db
    tb       = zbxdb_conn.tb
    querySQL = nowport10.querySQL

    ## 查询语句
    sql = querySQL.format(db, tb, startUtime, filterKey)

    ## 生成数据列表
    dataList = data_query(sql)

    ## 汇总数据列表和阴影列表
    dataList += stealth_list(dataList)

    ## 生成标签列表
    legendList = [ x.get('name') for x in dataList ]

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

    ## 存储结果到数据库
    mysql_update(
        host     = mysql_conn.host,
        user     = mysql_conn.user,
        passwd   = mysql_conn.passwd,
        port     = mysql_conn.port,
        db       = mysql_conn.db,
        tb       = mysql_conn.tb,
        name     = nowport10.label,
        data     = outputStr,
        unixTime = int(time.time())
    )

## 调试
if __name__ == '__main__':
    main()
