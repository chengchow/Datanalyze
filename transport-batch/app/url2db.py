# -*- coding: utf-8 -*-
"""
从相关url中获取数据并写入数据库datanalyze.carriage表, 表结构如下：
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| code     | varchar(50) | NO   | PRI | NULL    |       |
| value    | float(20,2) | NO   |     | NULL    |       |
| wds      | varchar(20) | NO   |     | NULL    |       |
| year     | int(4)      | NO   |     | NULL    |       |
| unixtime | int(10)     | NO   |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
"""

## 调用 python 模块
import os,sys,json,time
import logging
import pymysql

## 获取根路径, 并添加到环境变量中 
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局配置文件中引用相关变量
from config import queryUrl,dfwdsList,logFormat,headersUserAgent

##从全局函数文件中引用相关函数
from functions import get_data,mysql_update

## 指定日志格式
logFormat

## 程序部分
def main(**kwargs):
    unixTime  = int(time.time())
    url       = queryUrl
    hua       = headersUserAgent
    m         = 'QueryData'
    rowCode   = 'zb'
    colCode   = 'sj'
    dbCode    = 'hgnd'
    wds       = '[]'
    dwList    = dfwdsList

    ## 定义汇总列表
    totalList = []
    ## 获取url数据，轮询依次从dfwds中执行
    for dfwds in dwList:
        try:
            data = get_data(
                url              = url,
                headersUserAgent = hua, 
                m                = m,
                rowCode          = rowCode,
                colCode          = colCode,
                dbCode           = dbCode,
                wds              = wds,
                dfwds            = dfwds
            )
        except Exception as e:
            ## 执行失败, 转执行下一个索引值
            logging.warning('获取数据{}失败'.format(dfwds))
            continue
        else:
            logging.info('获取数据{}成功'.format(dfwds))
            ## 从get请求数据中获取写入数据库需要的数据
            reValueList = [
                (x.get('code'),
                float(x.get('data').get('data')),
                x.get('wds')[0].get('valuecode'),
                int(x.get('wds')[1].get('valuecode')),
                unixTime) 
                for x in data.get('returndata').get('datanodes') 
                if int(data.get('returncode')) < 400
            ]
        ## 数据汇总
        totalList += reValueList

    ## 轮询执行汇总列表
    for x in totalList:
        ## 获取数据库code,value,wds,year,unixtime对应值, x是元组, 有5个元素
        code,value,wds,year,unixTime = x
        ## 写入数据库
        mysql_update (
            code     = code,
            value    = value,
            wds      = wds,
            year     = year,
            unixTime = unixTime
        )

## 调试
if __name__ == '__main__':
    main()
