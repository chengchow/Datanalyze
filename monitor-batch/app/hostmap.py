# -*- coding: utf-8 -*-
"""
机房坐标及数量图
"""

## 调用python模块
import os,sys,json,time

## 获取根目录, 并添加到全局环境变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量文件中引用相应变量
from config import hostmap, logFormat, zbxdb_conn, mysql_conn, query

## 从全局函数文件中引用相应函数
from functions import mysql_update, mysql_query, load_yaml_file, load_json_file

## 从yaml文件中获取数据, 并转置为数组
yamlFile = hostmap.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 从json文件中获取数据, 并转置为数组
jsonFile = query.axisFile
jsonDict = load_json_file(jsonFile)

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

## 主程序
def main():
    ## 从yaml列表中获取数据
    titleName   = yamlDict.get('titleName')
    subName     = yamlDict.get('subName')
    subLink     = yamlDict.get('subLink')
    valueMin    = yamlDict.get('valueMin')
    valueMax    = yamlDict.get('valueMax')
    textTagList = yamlDict.get('textTagList')

    ## 查询数据库
    db       = zbxdb_conn.db
    tb       = 'hosts_groups'
    querySQL = hostmap.querySQL

    ## 获取坐标索引列表
    indexList = [ x.get('name') for x in textTagList ]
    ## 坐标列表
    axisList  = [ jsonDict.get(x) for x in indexList ]
    ## 转置坐标索引坐标列表为坐标字典
    axisDict =dict(
        zip(indexList, axisList)
    )

    ## 生成数据列表
    valueList = [
        {
            'name'     : x.get('name'),
            'count'    : data_query(querySQL.format(db,tb,x.get('groupid'))),
            'iconsize' : x.get('iconsize')
        }  
        for x in textTagList
    ]

    ## 最大值和最小值
    valueMax = valueMax or max(x.get('count') for x in valueList)
    valueMin = valueMin or min(x.get('count') for x in valueList)

    ## 生成数据列表
    dataList = [
        {
            'name': x.get('name'),
            'value': x.get('count')
        } 
        for x in valueList
    ]

    ## 输出字典
    outputDict = {
        'name'    : titleName,
        'subname' : subName,
        'sublink' : subLink,
        'max'     : valueMax,
        'min'     : valueMin,
        'axis'    : axisDict,
        'data'    : dataList
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
        name     = hostmap.label,
        data     = outputStr,
        unixTime = int(time.time())
    )

## 调试
if __name__ == '__main__':
    main()
