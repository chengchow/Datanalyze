# -*- coding: utf-8 -*-
"""
运输线路长度
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
from config import lengthline, mysql_conn, logFormat

## 从全局函数文件中引用相应的函数
from functions import mysql_query, list_uniq, load_yaml_file

## 获取yaml文件数据, 并转成数组
yamlFile = lengthline.yamlFile
yamlDict = load_yaml_file(yamlFile)

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
def series(_resultList, _dict ,_divUnit, _picType, _yearList):
    return {
        'name' : _dict.get('name'),
        'type' : _picType,
        'data' : [ per_list(y, _dict.get('wds'), _resultList, _divUnit) for y in _yearList ]
    }

## 获取series列表信息
def series_mod(**kwargs):
    ## 从yaml文件数组中获取数据
    _picType=yamlDict.get('picType')
    
    ## 获取数据库信息
    _mysqlDB   = lengthline.db      or mysql_conn.db
    _mysqlTB   = lengthline.tb      or mysql_conn.tb
    _mysqlHost = lengthline.host    or mysql_conn.host
    _mysqlUser = lengthline.user    or mysql_conn.user
    _mysqlPass = lengthline.passwd  or mysql_conn.passwd
    _mysqlPort = lengthline.port    or mysql_conn.port
    _mysqlChrt = lengthline.charset or mysql_conn.charset

    ## 获取数据索引分支名称
    _branchName = kwargs.get('branchName')

    ## 获取分支索引列表
    _textTagList   = yamlDict.get(_branchName).get('textTagList')
    _divUnit       = yamlDict.get(_branchName).get('divUnit') or 1
    _filterKeyList = [ w.get('wds') for w in _textTagList ]

    ## 根据元组长度判断sql查询语句
    ### python单元素元组写法是(e,), 直接用IN查询会失败
    if len(_filterKeyList) == 1:
        _sql = "SELECT year,value,wds FROM `{}`.`{}` WHERE wds='{}' ORDER BY year".format(
             _mysqlDB, _mysqlTB, _filterKeyList[0])
    elif len(_filterKeyList) > 1:
        _sql = "SELECT year,value,wds FROM `{}`.`{}` WHERE wds IN {} ORDER BY year".format(
             _mysqlDB, _mysqlTB, tuple(_filterKeyList))

    ## 调用数据库查询函数查询结果
    _resultList = mysql_query(
        cmd     = _sql,
        host    = _mysqlHost,
        user    = _mysqlUser,
        passwd  = _mysqlPass,
        port    = _mysqlPort,
        charset = _mysqlChrt
    )

    ## 获取X轴刻度列表
    _yearList = [ y.get('year') for y in _resultList ]
    ## 刻度列表修正(去重)
    _yearList = list_uniq(_yearList)
    ## 刻度列表重新排序
    list.sort(_yearList)

    ## 获取series列表
    _seriesList = [ series(_resultList, _x, _divUnit, _picType, _yearList) for _x in _textTagList ]

    ## 返回数据
    return {
        'year':_yearList, 
        'series':_seriesList
    }

## 主程序
def main():
    ## 从yaml文件数组中获取数据
    colorList = yamlDict.get('colorList')
    titleName = yamlDict.get('titleName')
    yUnit     = yamlDict.get('yUnit')

    ## 获取相应分支对应数据
    longDict  = series_mod(branchName = 'long')
    shortDict = series_mod(branchName = 'short')

    ## 获取series列表
    seriesList = longDict.get('series') + shortDict.get('series')

    ## 获取x刻度列表
    yearList   = list_uniq(longDict.get('year') + shortDict.get('year'))

    ## 获取标签列表
    legendList = [ x.get('name') for x in seriesList ]

    ## 生成输出列表
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
