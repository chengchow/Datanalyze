# -*- coding: utf-8 -*-
"""
"""

## 调用模块
import os,sys,json,time
import logging
import pymysql

## 全局变量引用
nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局配置中引用相关变量
from config import hostmap,logFormat,zbxdb_conn,mysql_conn,query
##从全局函数中引用相关函数
from functions import mysql_update,mysql_query,load_yaml_file,load_json_file

## 指定日志格式
logFormat

## 获取yaml数据
yamlFile=hostmap.yamlFile
yamlDict=load_yaml_file(yamlFile)

## 获取json数据，从坐标文件
jsonFile=query.axisFile
jsonDict=load_json_file(jsonFile)

## 在数据库中查询结果
def data_query(_sql):
    ## 查询结果字典
    _hostCountList=mysql_query(
        cmd=_sql,
        host=zbxdb_conn.host,
        user=zbxdb_conn.user,
        passwd=zbxdb_conn.passwd,
        port=zbxdb_conn.port,
        charset='utf8'
    )

    ## 结果查询
    if len(_hostCountList)==1:
        _hostCount=_hostCountList[0].get('result')
    else:
        logging.error('查询结果不存在或不唯一. ')
    return _hostCount

## 主程序
def main():
    ## 画图参数
    titleName=yamlDict.get('titleName')
    subName=yamlDict.get('subName')
    subLink=yamlDict.get('subLink')
    valueMin=yamlDict.get('valueMin')
    valueMax=yamlDict.get('valueMax')
    textTagList=yamlDict.get('textTagList')

    ## 查询数据库(监控)信息
    db=zbxdb_conn.db
    tb='hosts_groups'
    querySQL=hostmap.querySQL

    ## 获取索引列表
    indexList=[x.get('name') for x in textTagList]

    ## 坐标列表
    axisList=[jsonDict.get(x) for x in indexList]

    ## 坐标字典
    axisDict=dict(zip(indexList,axisList))

    ## 数据列表
    valueList=[{'name': x.get('name'),'count': data_query(querySQL.format(
       db,tb,x.get('groupid'))),'iconsize':x.get('iconsize'),}  for x in textTagList]

    ## 求最大主机和最小主机
    valueMax=valueMax or max(x.get('count') for x in valueList)
    valueMin=valueMin or min(x.get('count') for x in valueList)

    ## 输出数据列表
#    dataList=[{'name': x.get('name'),'value':[x.get('iconsize'),"主机数量: {}".format(
#        x.get('count'))]} for x in valueList]
    dataList=[{'name': x.get('name'),'value': x.get('count')} for x in valueList]

    ## 输出字典
    outputDict={
        'name' : titleName,
        'subname' : subName,
        'sublink' : subLink,
        'max' : valueMax,
        'min' : valueMin,
        'axis' : axisDict,
        'data' : dataList
    }

    ## 输出字典转字符串
    outputStr=json.dumps(outputDict,ensure_ascii=False)

    ## 存储结果到mysql数据库
    mysql_update(
        host=mysql_conn.host,
        user=mysql_conn.user,
        passwd=mysql_conn.passwd,
        port=mysql_conn.port,
        db=mysql_conn.db,
        tb=mysql_conn.tb,
        name=hostmap.label,
        data=outputStr,
        unixTime=int(time.time())
    )

## 调试
if __name__ == '__main__':
    main()
