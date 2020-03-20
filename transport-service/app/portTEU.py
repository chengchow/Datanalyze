# -*- coding: utf-8 -*-
"""
沿海规模以上港口(前十)分货类吞吐量
"""

## 调用python函数
import os,sys
import json

## 获取根路径, 并添加到路径变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量文件中引用相应的变量
from config import portTEU, mysql_conn, query

## 从全局函数文件中引用相应的函数
from functions import mysql_query, load_yaml_file, load_json_file

## 获取yaml文件数据, 并转成数组
yamlFile = portTEU.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 数据列表排序取前10, 并追加透明部分数据
def semicircle(_list, _value):
    import copy
    ## 列表根据元素的_value值反向排序
    _sortList = sorted(_list, key = lambda _list: _list[_value],reverse = True)
    ## 截取列表前十
    _entityList = _sortList[:10]
    ## 参考数据列表创建透明列表
    _lucencyList = copy.deepcopy(_entityList)
    ## 透明列表数据修正
    [ x.update(itemStyle = {'color': 'transparent'}, label = {'show': 'false'}, labelLine = {'show': 'false'}, name = '') for x in _lucencyList]
    ## 合并数据列表和透明列表并返回
    return _entityList + _lucencyList

## 数据库结果查询
def mysql_result(indexDict):
    ## 获取数据库信息
    mysqlDB   = portTEU.db      or mysql_conn.db
    mysqlTB   = portTEU.tb      or mysql_conn.tb
    mysqlHost = portTEU.host    or mysql_conn.host
    mysqlUser = portTEU.user    or mysql_conn.user
    mysqlPass = portTEU.passwd  or mysql_conn.passwd
    mysqlPort = portTEU.port    or mysql_conn.port
    mysqlChrt = portTEU.charset or mysql_conn.charset

    filterKeys = indexDict.get('wds')

    sql = "SELECT year,value FROM {db}.{tb} WHERE wds='{fk}' \
         AND year=(SELECT MAX(year) FROM {db}.{tb} WHERE wds='{fk}' AND value!=0)".format(
         db = mysqlDB, tb = mysqlTB, fk = filterKeys)

    result = mysql_query(
        cmd      = sql,
        host     = mysqlHost,
        user     = mysqlUser,
        passwd   = mysqlPass,
        port     = mysqlPort,
        charset  = mysqlChrt,
        fetchone = 1
    )

    return result

def main():
    ## 从yaml文件数组中获取数据
    textTagList = yamlDict.get('textTagList')
    colorList   = yamlDict.get('colorList')
    yUnit       = yamlDict.get('yUnit')
    divUnit     = yamlDict.get('divUnit')
    picType     = yamlDict.get('picType')

    ## 数据列表
    dataList = [{
        'name': w.get('name'), 
        'value': round(mysql_result(w).get('value')/divUnit,2)} 
    for w in textTagList ]

    ## 定义排序索引的键值
    sortKey = 'value'
    ## 取出画图列表
    drawList = semicircle(dataList,sortKey)

    ##标签列表
    labelList = [x.get('name') for x in drawList]

    ## 生成输出字典
    outputDict = {
        'color' : colorList,
        'label' : labelList, 
        'data'  : drawList
    }

    ## 转json字符串,不转码
    outputStr = json.dumps(
        outputDict,
        ensure_ascii = False
    )

    ## 返回结果
    return outputStr

## 调试
if __name__=='__main__':
    print(main())
