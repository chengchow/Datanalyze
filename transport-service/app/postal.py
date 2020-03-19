# -*- coding: utf-8 -*-
"""
邮电业务量
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
from config import postal, mysql_conn, logFormat

## 从全局函数文件中引用相应的函数
from functions import mysql_query, list_uniq, load_yaml_file

## 获取yaml文件数据, 并转成数组
yamlFile = postal.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 从yaml文件数组中获取数据
colorList  = yamlDict.get('colorList')
titleName  = yamlDict.get('titleName')
yUnit      = yamlDict.get('yUnit')
picType    = yamlDict.get('picType')
totalLabel = yamlDict.get('totalLabel')

## 获取数据库信息
mysqlDB   = postal.db      or mysql_conn.db
mysqlTB   = postal.tb      or mysql_conn.tb
mysqlHost = postal.host    or mysql_conn.host
mysqlUser = postal.user    or mysql_conn.user
mysqlPass = postal.passwd  or mysql_conn.passwd
mysqlPort = postal.port    or mysql_conn.port
mysqlChrt = postal.charset or mysql_conn.charset

## 指定日志格式
logFormat

## 从resultList中查询对应year, wds的值, 并运算后返回
def per_list(_year, _wds, _resultList, _div):
    _xList = [ round(_x.get('value')/_div, 2) for _x in _resultList if _x.get('year') == _year and _x.get('wds') == _wds ]
    if len(_xList) == 1:
        return _xList[0]
    else:
        logging.warning('数据库存在重复数据, 查询数据返回值不唯一: year={}, wds={}, command={}'.format(
            _year, _wds, sys.argv[0]))
        return round(sum(_xList)/len(_xList), 2)

## 根据带人参数查询结果并格式化输出
def series(_resultList, _dict ,_divUnit, picType, _yearList):
    return {
        'name' : _dict.get('name'),
        'type' : picType,
        'data' : [ per_list(y, _dict.get('wds'), _resultList, _divUnit) for y in _yearList ]
    }

## 主程序部分
def series_mod(**kwargs):
    ## 通过参数获取分支名称
    _branchName=kwargs.get('branchName')

    ## 获取对应分支数据在yaml数据中
    _textTagList   = yamlDict.get(_branchName).get('textTagList')
    _divUnit       = yamlDict.get(_branchName).get('divUnit') or 1
    _filterKeyList = [ w.get('wds') for w in _textTagList ]

    ## 根据元组长度判断sql查询语句
    ### python单元素元组写法是(e,), 直接用IN查询会失败
    if len(_filterKeyList) == 1:
        _sql = "SELECT year,value,wds FROM `{}`.`{}` WHERE wds='{}' ORDER BY year".format(
             mysqlDB, mysqlTB, _filterKeyList[0])
    elif len(_filterKeyList) > 1:
        _sql = "SELECT year,value,wds FROM `{}`.`{}` WHERE wds IN {} ORDER BY year".format(
             mysqlDB, mysqlTB, tuple(_filterKeyList))

    ## 调用数据库查询函数查询结果
    _resultList = mysql_query(
        cmd     = _sql,
        host    = mysqlHost,
        user    = mysqlUser,
        passwd  = mysqlPass,
        port    = mysqlPort,
        charset = mysqlChrt
    )

    ## 获取X轴刻度列表
    _yearList = [ y.get('year') for y in _resultList ]
    ## 刻度列表修正(去重)
    _yearList = list_uniq(_yearList)
    ## 刻度列表重新排序
    list.sort(_yearList)

    ## 获取series列表
    _seriesList = [ series(_resultList, _x, _divUnit, picType, _yearList) for _x in _textTagList ]

    ## 返回年份列表和series列表
    return {
        'year':_yearList, 
        'series':_seriesList
    }

def main():
    ## 获取不同分支数据
    longDict  = series_mod(branchName='long')
    shortDict = series_mod(branchName='short')

    ## 获取series列表
    seriesList = longDict.get('series') + shortDict.get('series')

    ## 统计汇总数据
    totalList = [ round(sum(x),2) for x in list(zip(*[y.get('data') for y in seriesList])) ]

    ## 修正series列表数据(添加汇总数据)
    seriesList.append({
        'name' : totalLabel,
        'type' : picType,
        'data' : totalList
    })

    ## 获取X轴刻度列表
    yearList = list_uniq(longDict.get('year') + shortDict.get('year') )
    ## 获取标签列表
    legendList = [ x.get('name') for x in seriesList ]

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

    ## 返回结果
    return outputStr

## 调试
if __name__ == '__main__':
    print(main())
