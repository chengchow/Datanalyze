# -*- coding: utf-8 -*-
"""
快递业务量
"""

## 添加全局变量及函数
import os,sys
import json
import datetime
import time
import logging

## 追加环境变量
nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量中引用nowport10变量
from config import nowport10,zbxdb_conn,mysql_conn

## 从全局函数中调用hive查询, 列表去重模块
from functions import load_yaml_file,pre_twelve_month,mysql_query,mysql_update

## 获取yaml数据
yamlFile=nowport10.yamlFile
yamlDict=load_yaml_file(yamlFile)

## 修正监控名称为项目名称
def mon_proj(_mon):
    _proj=str(_mon.split()[1:-2]).replace('[','').replace(']','').replace('\'','').replace(',','_').replace(' ','')
    return _proj

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

    _dataList=[{'name': mon_proj(x.get('name')), 'value': x.get('result')} for x in _hostCountList]

    ## 结果查询
    return _dataList

## 生成隐形列表
def stealth_list(_list):
    stealthList=[{'name': '','value': x.get('value'),'itemStyle':{'color': 'transparent'},'label':{'show':'false'},'labelLine':{'show':'false'}} for x in _list]
    return stealthList

## 主程序
def main():
    ## 定义相关标签及输出格式
    _filter=yamlDict.get('filter')
    colorList=yamlDict.get('colorList')
    titleName=yamlDict.get('titleName')
    yUnit=yamlDict.get('yUnit')
    divUnit=yamlDict.get('divUnit') or 1

    ## 取出本月开始时间
    clockList=pre_twelve_month()
    startUtime=clockList[-1][-1]

    ## mysql连接信息
    db=zbxdb_conn.db
    tb=zbxdb_conn.tb
    querySQL=nowport10.querySQL

    ## 查询语句
    sql=querySQL.format(db,tb,startUtime,_filter)

    ## 生成数据列表
    dataList=data_query(sql)

    ## 汇总数据列表和隐形列表
    dataList+=stealth_list(dataList)

    ## 获取标签列表
    legendList=[x.get('name') for x in dataList]

    ## 生成输出字典
    outputDict={
        'title': titleName,
        'label': legendList,
        'color': colorList,
        'data': dataList
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
        name=nowport10.label,
        data=outputStr,
        unixTime=int(time.time())
    )

## 调试
if __name__ == '__main__':
    main()
