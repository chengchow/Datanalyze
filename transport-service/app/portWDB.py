# -*- coding: utf-8 -*-
"""
沿海(江)主要规模以上港口码头泊位数(万吨位)
"""

## 添加全局变量及函数
import os,sys
import json

nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量中引用portWDB变量
from config import portWDB,mysql_conn,query

## 从全局函数中调用hive查询, 列表去重模块
from functions import mysql_query,load_yaml_file,load_json_file

## 获取yaml数据
yamlFile=portWDB.yamlFile
yamlDict=load_yaml_file(yamlFile)

## 获取json数据，从坐标文件
jsonFile=query.coordQueryFile
jsonDict=load_json_file(jsonFile)

def main():
    ## 获取yaml数据
    textTagList=yamlDict.get('textTagList')
    colorMin=yamlDict.get('colorMin')
    colorMax=yamlDict.get('colorMax')
    titleName=yamlDict.get('titleName')
    subName=yamlDict.get('subName')
    subLink=yamlDict.get('subLink')
    yUnit=yamlDict.get('yUnit')
    divUnit=yamlDict.get('divUnit')
    picType=yamlDict.get('picType')

    ##获取hive连接信息
    mysqlDB=portWDB.db or mysql_conn.db
    mysqlTB=portWDB.tb or mysql_conn.tb
    mysqlHost=portWDB.host or mysql_conn.host
    mysqlUser=portWDB.user or mysql_conn.user
    mysqlPass=portWDB.passwd or mysql_conn.passwd
    mysqlPort=portWDB.port or mysql_conn.port
    mysqlChrt=portWDB.charset or mysql_conn.charset

    ## 关键词列表
    indexList=[w.get('name') for w in textTagList]

    ## 坐标列表
    axisList=[jsonDict.get(x) for x in indexList]

    ## 坐标输出字典
    axisDict=dict(zip(indexList,axisList))

    ## 数据列表
    dataList=[]
    yearList=[]
    for w in textTagList:
        filterKeys=w.get('code')
        sql="SELECT year,value FROM {db}.{tb} WHERE wds='{fk}' \
             AND year=(SELECT MAX(year) FROM {db}.{tb} WHERE wds='{fk}' AND value!=0)".format(
             db=mysqlDB, tb=mysqlTB, fk=filterKeys)
        result=mysql_query(
            cmd=sql,
            host=mysqlHost,
            user=mysqlUser,
            passwd=mysqlPass,
            port=mysqlPort,
            charset=mysqlChrt
        )


        ## 如果存在万吨泊位，添加到数据列表
        if result:
            totalValue=round(result[0][1]/divUnit)
            yearList.append(result[0][0])
            dataList.append({
                'name': w.get('name'),
                'value': totalValue
            })
        else:
            ## 如果该码头不存在万吨泊位，删除多余坐标
            del axisDict[w.get('name')]
 
    ## 年份列表去重
    yearList=list(set(yearList))

    ## 修正标题名称
    if len(yearList)==1:
        titleName=str(max(yearList))+'年'+titleName+'(单位: '+yUnit+')'
    else:
        titleName=str(min(yearList))+'-'+str(max(yearList))+'年'+titleName+'(单位: '+yUnit+')'

    ## 最大值
    _max=max(x.get('value') for x in dataList)
    ## 最小值
    _min=min(x.get('value') for x in dataList)

    ## 生成输出字典
    outputDict={
        'name': titleName,
        'subname': subName,
        'sublink': subLink,
        'colorMax': colorMax, 
        'colorMin': colorMin,
        'max': _max,
        'min': _min,
        'axis': axisDict, 
        'data': dataList
    }

    ## 转json字符串,不转码
    outputStr=json.dumps(outputDict,ensure_ascii=False)

    ## 存储结果到mysql数据库
    return outputStr

if __name__=='__main__':
    print(main())
