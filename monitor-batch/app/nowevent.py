# -*- coding: utf-8 -*-
"""
快递业务量
"""

## 添加全局变量及函数
import os,sys
import json
import datetime
import time

## 追加环境变量
nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量中引用nowevent变量
from config import nowevent,zbxdb_conn,mysql_conn

## 从全局函数中调用hive查询, 列表去重模块
from functions import load_yaml_file,pre_twelve_month,mysql_query,mysql_update

## 获取yaml数据
yamlFile=nowevent.yamlFile
yamlDict=load_yaml_file(yamlFile)

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

def data_list(_dict,_clockList,_divUnit):
    ## 查询数据库(监控)信息
    db=zbxdb_conn.db
    tb='events'
    querySQL=nowevent.querySQL
    nowMonTime=_clockList[-1][-1]

    if isinstance(_dict.get('severity'),int):
        logic="="
        severity=_dict.get('severity')
    elif isinstance(_dict.get('severity'),list):
        logic="IN"
        severity=tuple(_dict.get('severity'))

    data=data_query(querySQL.format(
        db,tb,logic,severity,nowMonTime,_dict.get('filter')))/_divUnit
    return data

## 主程序
def main():
    ## 定义相关标签及输出格式
    textTagList=yamlDict.get('textTagList')
    legendList=[x.get('name') for x in textTagList]
    colorList=yamlDict.get('colorList')
    titleName=yamlDict.get('titleName')
    yUnit=yamlDict.get('yUnit')
    divUnit=yamlDict.get('divUnit') or 1

    clockList=pre_twelve_month()
    dataList=[{'name': x.get('name'),'value':data_list(x,clockList,divUnit)} for x in textTagList]

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
        name=nowevent.label,
        data=outputStr,
        unixTime=int(time.time())
    )

## 调试
if __name__ == '__main__':
    main()
