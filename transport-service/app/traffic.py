# -*- coding: utf-8 -*-
"""
汽车拥有量，包含：
1. 民用汽车
2. 私人汽车
3. 新注册汽车
4. 公路营运汽车
"""

## 调用python函数
import os,sys
import json

## 获取根路径, 并添加到路径变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量文件中引用相应的变量
from config import traffic, mysql_conn, logFormat

## 从全局函数文件中引用相应的函数
from functions import mysql_query, load_yaml_file, list_uniq

## 获取yaml文件数据, 并转成数组
yamlFile = traffic.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 过滤关键词, 查询结果, 返回时间和结果函数
def get_result(_dict):
    filterKeys = _dict.get('wds')

    ## 获取数据库信息
    mysqlDB   = traffic.db      or mysql_conn.db
    mysqlTB   = traffic.tb      or mysql_conn.tb
    mysqlHost = traffic.host    or mysql_conn.host
    mysqlUser = traffic.user    or mysql_conn.user
    mysqlPass = traffic.passwd  or mysql_conn.passwd
    mysqlPort = traffic.port    or mysql_conn.port
    mysqlChrt = traffic.charset or mysql_conn.charset

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

## 过滤关键词生成单个项目环图及嵌套饼图数据
def get_data(_dict):
     yUnit       = yamlDict.get('yUnit')
     divUnit     = yamlDict.get('divUnit') or 1

     ## 时间刻度列表
     yearList = [ get_result(x).get('year') for x in _dict.get('total') ]

     ## 数据列表
     masterList = [{
         'name'  : x.get('name') ,
         'value' : round(get_result(x).get('value') / divUnit,2)
     } for x in _dict.get('total') ]

     ## 汇总值
     totalValue = sum(x.get('value') for x in masterList)

     ## 年份列表去重
     yearList = list(set(yearList))

     ## 生成标题前缀
     if len(yearList) == 1:
         yearName = str(yearList[0]) + '年'
     else:
         yearName = str(min(yearList)) + '-' + str(max(yearList)) + '年'

     ## 总数列表其他数据
     name   = yearName + _dict.get('name') + yUnit
     radius = _dict.get('master').get('radius')
     center = _dict.get('master').get('center')

     ## 总数列表
     pieDict = {
         'name'   : name,
         'radius' : radius,
         'center' : center,
         'data'   : masterList
     }

     ## 数据列表
     branchList = [{
         'name'  : x.get('name') ,
         'value' : round(get_result(x).get('value') / divUnit,2)
     } for x in _dict.get('specific') ]

     ## 剩余值
     otherValue = totalValue - sum(x.get('value') for x in branchList)

     ## 修正其他值由四舍五入导致的负数
     if otherValue <= 0:
         otherValue = 0

     ## 环形数据添加other选项
     branchList.append({
         'name'  : '其他',
         'value' : round(otherValue, 2)
     })
     
     ## 分支列表其他数据
     name   = yearName + _dict.get('name') + yUnit
     radius = _dict.get('branch').get('radius')
     center = _dict.get('branch').get('center')

     ## 生成最终数据列表
     circleDict = {
         'name'   : name,
         'radius' : radius,
         'center' : center,
         'data'   : branchList
     }

     return [ pieDict, circleDict ]

## 获取说明标签函数
def legend():
    ## 生成标签列表
    _legendList = [ w.get('name') for e in yamlDict.get('textTagList') for w in e.get('specific') ]
    ## 修正标签列表(添加'其他'标签)
    _legendList.append(yamlDict.get('otherLabel'))
    ## 修正标签列表(列表去重)
    _legendList = list_uniq(_legendList)

    return _legendList

## 主程序
def main():
    ## 从yaml文件数组中获取数据
    textTagList = yamlDict.get('textTagList')
    colorList   = yamlDict.get('colorList')
    titleName   = yamlDict.get('titleName')

    ## 定义输出的数据列表
    dataList = [ get_data(x) for x in textTagList ]

    ## 修正数据列表(合并子列表)
    dataList = [ y for x in dataList for y in x ]

    ## 生成最终输出列表
    outputDict = {
        'name'  : titleName,
        'label' : legend(),
        'color' : colorList,
        'data'  : dataList
    }

    ## 转json字符串,不转码
    outputStr = json.dumps(
        outputDict,
        ensure_ascii = False
    )

    ## 返回结果
    return outputStr

if __name__ == '__main__':
    print(main())
