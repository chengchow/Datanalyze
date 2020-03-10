# -*- coding: utf-8 -*-
"""
汽车拥有量，包含：
1. 民用汽车
2. 私人汽车
3. 新注册汽车
4. 公路营运汽车
"""

## 添加全局变量及函数
import os,sys
import json

nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量中引用motor变量
from config import motor,mysql_conn

## 从全局函数中调用hive查询, 列表去重模块
from functions import mysql_query,load_yaml_file

## 获取yaml数据
yamlFile=motor.yamlFile
yamlDict=load_yaml_file(yamlFile)

## 定义说明标签
def legend():
    _legendSet=set()
    for e in yamlDict.get('textTagList'):
        [_legendSet.add(w.get('name')) for w in e.get('specific')]
    _legendList=list(_legendSet)
    _legendList.append(yamlDict.get('otherLabel'))
    return _legendList

## 主程序
def main():
    ## 读取yaml数据
    textTagList=yamlDict.get('textTagList')
    colorList=yamlDict.get('colorList')
    titleName=yamlDict.get('titleName')
    yUnit=yamlDict.get('yUnit')
    divUnit=yamlDict.get('divUnit') or 1

    ## 获取hive连接信息
    mysqlDB=motor.db or mysql_conn.db
    mysqlTB=motor.tb or mysql_conn.tb
    mysqlHost=motor.host or mysql_conn.host
    mysqlUser=motor.user or mysql_conn.user
    mysqlPass=motor.passwd or mysql_conn.passwd
    mysqlPort=motor.port or mysql_conn.port
    mysqlChrt=motor.charset or mysql_conn.charset

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
                charset=mysqlChrt
            )
            totalValue+=round(float(result[0][1])/divUnit,2)
            ## 获取数据年份
            year=str(result[0][0])+'年'

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
                charset=mysqlChrt)[0][1])/divUnit,2)
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

    outputDict={
        'name': titleName,
        'label': legend(),
        'color': colorList,
        'data': dataList
    }

    ## 转json字符串,不转码
    outputStr=json.dumps(outputDict,ensure_ascii=False)

    ## 存储结果到mysql数据库
    return outputStr

if __name__ == '__main__':
    print(main())
