# -*- coding: utf-8 -*-
"""
交通运输、邮电通信业就业人员数
"""

## 添加全局变量及函数
import os,sys
import json

nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量中引用employ变量
from config import employ,mysql_conn

## 从全局函数中调用hive查询, 列表去重模块
from functions import mysql_query,list_uniq,load_yaml_file

## 获取yaml数据
yamlFile=employ.yamlFile
yamlDict=load_yaml_file(yamlFile)

## 获取对应dfwds.code对应的就业人数，按年份列表输出
def per_list(_year,_wds,_resultList,_div):
    _xList=[round(_x[1]/_div,2) for _x in _resultList if _x[0]==_year and _x[2]==_wds]
    return _xList[-1]

## 主程序
def main():
    ## 获取画图数据
    textTagList=yamlDict.get('textTagList')
    legendList=[x.get('name') for x in textTagList]
    colorList=yamlDict.get('colorList')
    titleName=yamlDict.get('titleName')
    yUnit=yamlDict.get('yUnit')
    divUnit=yamlDict.get('divUnit') or 1
    picType=yamlDict.get('picType')
    otherTagList=yamlDict.get('otherTagList')
    otherName=yamlDict.get('otherName')

    ## 定义数据库名称，表名称及查询语句
    ## 备注: 测试环境性能太差，为节省时间，这里直接查询出运输业人数总数据。
    mysqlDB=employ.db or mysql_conn.db
    mysqlTB=employ.tb or mysql_conn.tb
    mysqlHost=employ.host or mysql_conn.host
    mysqlUser=employ.user or mysql_conn.user
    mysqlPass=employ.passwd or mysql_conn.passwd
    mysqlPort=employ.port or mysql_conn.port
    mysqlChrt=employ.charset or mysql_conn.charset

    ## 设置一个列表收集wds值
    keyList=[e.get('wds') for e in textTagList]
    ## wds集合转元组用于sql查询
    keyTuple=tuple(keyList)

    ## sql查询语句
    if len(keyTuple) == 1:
        sql="SELECT year,value,wds FROM `{}`.`{}` WHERE wds='{}'".format(
             mysqlDB, mysqlTB,keyTuple[0])
    elif len(keyTuple) > 1:
        sql="SELECT year,value,wds FROM `{}`.`{}` WHERE wds IN {}".format(
             mysqlDB, mysqlTB,keyTuple)

    ## 其他sql查询语句
    if len(otherTagList) == 1:
        otherSql="SELECT year,value value FROM `{}`.`{}` WHERE wds={}".format(
                  mysqlDB, mysqlTB,otherTagList)
    elif len(otherTagList) > 1:
        otherSql="SELECT year,sum(value) value FROM `{}`.`{}` WHERE wds IN {} group by year".format(
                  mysqlDB, mysqlTB,tuple(otherTagList))

    ## 获取查询结果，输出列表，详情查看functions脚本mysql_query模块
    resultList=mysql_query(
        cmd=sql,
        host=mysqlHost,
        user=mysqlUser,
        passwd=mysqlPass,
        port=mysqlPort,
        charset=mysqlChrt
    )

    ## 获取other查询结果，输出列表
    otherResultList=mysql_query(
        cmd=otherSql,
        host=mysqlHost,
        user=mysqlUser,
        passwd=mysqlPass,
        port=mysqlPort,
        charset=mysqlChrt
    )

    ## 获取年份列表
    yearList=[y[0] for y in resultList]

    ## 修正年份列表，添加other年份
    yearList+=[y[0] for y in otherResultList]

    ## 年份列表去重
    yearList=list_uniq(yearList)

    ## 年份类别排序
    list.sort(yearList)

    ## 定义series列表
    seriesList=[]
    for x in textTagList:
        ## 获取dfwds.code的数据列表
        perList=[per_list(y,x.get('wds'),resultList,divUnit) for y in yearList]
        ## 数据汇总列表修正(汇总列表-dfwds.code列表)
        seriesList.append({
            'name': x.get('name'), 
            'type': picType, 
            'data': perList
        })

    ## 获取other列表数据
    otherPerList=[round(w[1]/divUnit,2) for y in yearList for w in otherResultList if w[0]==y]

    ## 数据汇总列表修正，添加other数据
    seriesList.append({
        'name': otherName,
        'type': picType,
        'data': otherPerList
    })

    ## 标签类别修正，添加other标签
    legendList.append(otherName)

    ## 定义输出格式(字典)
    outputDict={
        'title': titleName, 
        'legend': legendList, 
        'color': colorList, 
        'xlabel': yearList, 
        'yname': yUnit, 
        'series': seriesList
    }
    ## 转json字符串,不转码
    outputStr=json.dumps(outputDict,ensure_ascii=False)

    ## 存储结果到mysql数据库
    return outputStr

## 调试
if __name__ == '__main__':
    print(main())
