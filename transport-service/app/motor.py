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
from config import motor, mysql_conn, logFormat

## 从全局函数文件中引用相应的函数
from functions import mysql_query, load_yaml_file, list_uniq

## 获取yaml文件数据, 并转成数组
yamlFile = motor.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 获取数据库信息
mysqlDB   = motor.db      or mysql_conn.db
mysqlTB   = motor.tb      or mysql_conn.tb
mysqlHost = motor.host    or mysql_conn.host
mysqlUser = motor.user    or mysql_conn.user
mysqlPass = motor.passwd  or mysql_conn.passwd
mysqlPort = motor.port    or mysql_conn.port
mysqlChrt = motor.charset or mysql_conn.charset

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
    yUnit       = yamlDict.get('yUnit')
    divUnit     = yamlDict.get('divUnit') or 1

    ## 获取数据库信息
    mysqlDB   = motor.db      or mysql_conn.db
    mysqlTB   = motor.tb      or mysql_conn.tb
    mysqlHost = motor.host    or mysql_conn.host
    mysqlUser = motor.user    or mysql_conn.user
    mysqlPass = motor.passwd  or mysql_conn.passwd
    mysqlPort = motor.port    or mysql_conn.port
    mysqlChrt = motor.charset or mysql_conn.charset

    ## 定义输出的数据列表
    dataList=[]
    for t in textTagList:
        ## 总数data列表
        masterList=[]
        totalValue=0
        for w in t.get('total'):
            filterKeys=w.get('wds')
            ## hive查询语句
            sql="SELECT year,value FROM {db}.{tb} WHERE wds='{fk}' \
                AND year=(SELECT MAX(year) FROM {db}.{tb} WHERE wds='{fk}' AND value!=0)".format(
                db=mysqlDB, tb=mysqlTB, fk=filterKeys)
            ## hive查询
            result=mysql_query(
                cmd=sql,
                host=mysqlHost,
                user=mysqlUser,
                passwd=mysqlPass,
                port=mysqlPort,
                charset=mysqlChrt,
                fetchone=1
            )
            totalValue+=round(float(result.get('value'))/divUnit,2)
            ## 获取数据年份
            year=str(result.get('year'))+'年'

            ## 总数data列表
            masterList.append({
                'name': w.get('name'),
                'value': totalValue
            })

        ## 总数列表其他数据
        name=year+t.get('name')+yUnit
        radius=t.get('master').get('radius')
        center=t.get('master').get('center')

        ## 总数列表
        dataList.append({
            'name': name,
            'radius': radius,
            'center': center,
            'data': masterList
        })

        ## 具体项列表
        branchList=[]
        ## 剩余值
        remainValue=totalValue
        for w in t.get('specific'):
            filterKeys=w.get('wds')
            sql="SELECT year,value FROM {db}.{tb} WHERE wds='{fk}' \
                AND year=(SELECT MAX(year) FROM {db}.{tb} WHERE wds='{fk}' AND value!=0)".format(
                db=mysqlDB, tb=mysqlTB, fk=filterKeys)
            specValue=round(float(mysql_query(
                cmd=sql,
                host=mysqlHost,
                user=mysqlUser,
                passwd=mysqlPass,
                port=mysqlPort,
                charset=mysqlChrt)[0].get('value'))/divUnit,2)
            remainValue-=specValue

            branchList.append({
                'name': w.get('name'),
                'value': specValue
            })

        ## 修正由四舍五入导致的误差
        if remainValue<=0:
            remainValue=0

        branchList.append({
            'name': '其他',
            'value': round(remainValue,2)
        })
        
        name=year+t.get('name')+yUnit
        radius=t.get('branch').get('radius')
        center=t.get('branch').get('center')

        dataList.append({
            'name': name,
            'radius': radius,
            'center': center,
            'data': branchList
        })

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
