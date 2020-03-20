# -*- coding: utf-8 -*-
"""
国家铁路主要车站货物发送量
"""

## 调用python函数
import os,sys
import json

## 获取根路径, 并添加到路径变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量文件中引用相应的变量
from config import railwayfreight, mysql_conn, query

## 从全局函数文件中引用相应的函数
from functions import mysql_query, load_yaml_file, load_json_file

## 获取yaml文件数据, 并转成数组
yamlFile = railwayfreight.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 获取json文件数据, 并转成数组
jsonFile = query.coordQueryFile
jsonDict = load_json_file(jsonFile)

## 过滤关键词, 查询结果, 返回时间和结果函数
def get_result(_dict):
    filterKeys = _dict.get('wds')

    ## 获取数据库信息
    mysqlDB   = railwayfreight.db      or mysql_conn.db
    mysqlTB   = railwayfreight.tb      or mysql_conn.tb
    mysqlHost = railwayfreight.host    or mysql_conn.host
    mysqlUser = railwayfreight.user    or mysql_conn.user
    mysqlPass = railwayfreight.passwd  or mysql_conn.passwd
    mysqlPort = railwayfreight.port    or mysql_conn.port
    mysqlChrt = railwayfreight.charset or mysql_conn.charset

    ## 查询语句
    sql = "SELECT year,value FROM {db}.{tb} WHERE wds='{fk}' \
         AND year=(SELECT MAX(year) FROM {db}.{tb} WHERE wds='{fk}' AND value!=0)".format(
         db = mysqlDB, tb = mysqlTB, fk = filterKeys)

    ## 查询结果
    resultDict = mysql_query(
        cmd      = sql,
        host     = mysqlHost,
        user     = mysqlUser,
        passwd   = mysqlPass,
        port     = mysqlPort,
        charset  = mysqlChrt,
        fetchone = 1
    )

    return resultDict

## 主程序
def main():
    ## 从yaml文件数组中获取数据
    textTagList = yamlDict.get('textTagList')
    colorMin    = yamlDict.get('colorMin')
    colorMax    = yamlDict.get('colorMax')
    titleName   = yamlDict.get('titleName')
    subName     = yamlDict.get('subName')
    subLink     = yamlDict.get('subLink')
    yUnit       = yamlDict.get('yUnit')
    divUnit     = yamlDict.get('divUnit')
    picType     = yamlDict.get('picType')

    ## 获取坐标索引列表
    indexList = [ w.get('name') for w in textTagList ]
    ## 获取坐标列表
    axisList = [ jsonDict.get(x) for x in indexList ]
    ## 转置坐标索引和坐标列表为坐标字典
    axisDict = dict(
        zip(indexList,axisList)
    )

    ## 时间刻度列表
    yearList = [ get_result(x).get('year') for x in textTagList ]

    ## 数据列表
    dataList = [{
        'name'  : x.get('name') ,
        'value' : round(get_result(x).get('value')/divUnit,2)
    } for x in textTagList ]

    ## 年份列表去重
    yearList = list(set(yearList))

    ## 修正标题名称
    if len(yearList) == 1:
        titleName = str(max(yearList)) + '年' + titleName + '(单位: ' + yUnit + ')'
    else:
        titleName = str(min(yearList)) + '-' + str(max(yearList)) + '年' + titleName + '(单位: ' + yUnit + ')'

    ## 取最大值和最小值
    _max = max(x.get('value') for x in dataList)
    _min = min(x.get('value') for x in dataList)

    ## 生成输出字典
    outputDict = {
        'name'     : titleName,
        'subname'  : subName,
        'sublink'  : subLink,
        'colorMax' : colorMax,
        'colorMin' : colorMin,
        'max'      : _max, 
        'min'      : _min,
        'axis'     : axisDict, 
        'data'     : dataList
    }

    ## 转json字符串,不转码
    outputStr = json.dumps(
        outputDict,
        ensure_ascii = False
    )

    ## 返回结果
    return outputStr

if __name__=='__main__':
    print(main())
