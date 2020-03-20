# -*- coding: utf-8 -*-
"""
货物运输平均运距
"""

## 调用python函数
import os,sys
import json
import logging

## 获取根路径, 并添加到路径变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量文件中引用相应的变量
from config import lengthfreight, mysql_conn, logFormat

## 从全局函数文件中引用相应的函数
from functions import mysql_query, list_uniq, load_yaml_file

## 获取yaml文件数据, 并转成数组
yamlFile = lengthfreight.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 指定日志格式
logFormat

## 从resultList中查询对应year, wds的值, 并运算后返回
def per_list(_year, _wds, _resultList, _div):
    _xList = [ round(_x.get('value')/_div, 2) for _x in _resultList if _x.get('year') == _year and _x.get('wds') == _wds ]
    if len(_xList) == 1:
        return _xList[0]
    else:
        logging.warning('查询结果冗余或为空: year={}, wds={}, command={}'.format(
            _year, _wds, sys.argv[0]))
        return round(sum(_xList)/len(_xList), 2)

## 根据带人参数查询结果并格式化输出
def series(_resultList, _dict ,_divUnit, _picType, _yearList):
    return {
        'name' : _dict.get('name'),
        'type' : _picType,
        'data' : [ per_list(y, _dict.get('wds'), _resultList, _divUnit) for y in _yearList ]
    }

## 主程序
def main():
    ## 从yaml文件数组中获取数据
    textTagList = yamlDict.get('textTagList')
    legendList  = [ x.get('name') for x in textTagList ]
    colorList   = yamlDict.get('colorList')
    titleName   = yamlDict.get('titleName')
    yUnit       = yamlDict.get('yUnit')
    divUnit     = yamlDict.get('divUnit') or 1
    picType     = yamlDict.get('picType')

    ## 获取数据库信息
    mysqlDB   = lengthfreight.db      or mysql_conn.db
    mysqlTB   = lengthfreight.tb      or mysql_conn.tb
    mysqlHost = lengthfreight.host    or mysql_conn.host
    mysqlUser = lengthfreight.user    or mysql_conn.user
    mysqlPass = lengthfreight.passwd  or mysql_conn.passwd
    mysqlPort = lengthfreight.port    or mysql_conn.port
    mysqlChrt = lengthfreight.charset or mysql_conn.charset

    ## 获取数据索引列表
    keyList  = [ e.get('wds') for e in textTagList ]
    ## 将索引列表转元组(方便数据库IN逻辑查询)
    keyTuple = tuple(keyList)

    ## 根据元组长度判断sql查询语句
    ### python单元素元组写法是(e,), 直接用IN查询会失败
    if len(keyTuple) == 1:
        sql = "SELECT year,value,wds FROM `{}`.`{}` WHERE wds='{}'".format(
             mysqlDB, mysqlTB, keyTuple[0])
    elif len(keyTuple) > 1:
        sql = "SELECT year,value,wds FROM `{}`.`{}` WHERE wds IN {}".format(
             mysqlDB, mysqlTB, keyTuple)

    ## 调用数据库查询函数查询结果
    resultList = mysql_query(
        cmd     = sql,
        host    = mysqlHost,
        user    = mysqlUser,
        passwd  = mysqlPass,
        port    = mysqlPort,
        charset = mysqlChrt
    )

    ## 获取X轴刻度列表
    yearList = [ y.get('year') for y in resultList ]
    ## 刻度列表修正(去重)
    yearList = list_uniq(yearList)
    ## 刻度列表重新排序
    list.sort(yearList)

    ## 获取series列表
    seriesList = [ series(resultList, x, divUnit, picType, yearList) for x in textTagList ]

    ## 生成输出字典
    outputDict = {
        'title'  : titleName, 
        'legend' : legendList, 
        'color'  : colorList, 
        'xlabel' : yearList, 
        'yname'  : yUnit, 
        'series' : seriesList
    }
    ## 转json字符串,不转码
    outputStr = json.dumps(
        outputDict,
        ensure_ascii = False
    )

    ## 返回数据
    return outputStr

## 调试
if __name__ == '__main__':
    print(main())
