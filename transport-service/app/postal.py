# -*- coding: utf-8 -*-
"""
邮电业务量
"""

## 添加全局变量及函数
import os,sys
import json

## 追加环境变量
nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量中引用express变量
from config import postal,mysql_conn

## 从全局函数中调用hive查询, 列表去重模块
from functions import mysql_query,list_uniq,load_yaml_file

## 获取yaml数据
yamlFile=postal.yamlFile
yamlDict=load_yaml_file(yamlFile)

## 获取画图数据 
colorList=yamlDict.get('colorList')
titleName=yamlDict.get('titleName')
yUnit=yamlDict.get('yUnit')
picType=yamlDict.get('picType')
totalLabel=yamlDict.get('totalLabel')

## 获取hive信息
mysqlDB=postal.db or mysql_conn.db
mysqlTB=postal.tb or mysql_conn.tb
mysqlHost=postal.host or mysql_conn.host
mysqlUser=postal.user or mysql_conn.user
mysqlPass=postal.passwd or mysql_conn.passwd
mysqlPort=postal.port or mysql_conn.port
mysqlChrt=postal.charset or mysql_conn.charset

## 获取对应dfwds.code对应的数据，按年份列表输出
def per_list(_year,_wds,_resultList,_div):
    _xList=[round(_x[1]/_div,2) for _x in _resultList if _x[0]==_year and _x[2]==_wds]
    return len(_xList)>=1 and _xList[-1] or 0.0

## 主程序部分
def series_mod(**kwargs):
    ## 通过参数获取分支名称
    _branchName=kwargs.get('branchName')

    ## 获取对应分支数据在yaml数据中
    _textTagList=yamlDict.get(_branchName).get('textTagList')
    _divUnit=yamlDict.get(_branchName).get('divUnit') or 1
    _filterKeyList=[w.get('wds') for w in _textTagList]

    ## HQL查询语句
    if len(_filterKeyList) == 1:
        _sql="SELECT year,value,wds FROM `{}`.`{}` WHERE wds='{}' ORDER BY year".format(
             mysqlDB, mysqlTB,_filterKeyList[0])
    elif len(_filterKeyList) > 1:
        _sql="SELECT year,value,wds FROM `{}`.`{}` WHERE wds IN {} ORDER BY year".format(
             mysqlDB, mysqlTB,tuple(_filterKeyList))

    ## 结果查询
    _resultList=mysql_query(
        cmd=_sql,
        host=mysqlHost,
        user=mysqlUser,
        passwd=mysqlPass,
        port=mysqlPort,
        charset=mysqlChrt
    )

    ## 获取年份列表并去重
    _yearList=[x[0] for x in _resultList]
    _yearList=list_uniq(_yearList)

    ## 统计series列表
    _seriesList=[]
    for x in _textTagList:
        _perList=[per_list(y,x.get('wds'),_resultList,_divUnit) for y in _yearList]
        _seriesList.append({
           'name': x.get('name'), 
           'type': picType, 
           'data': _perList
        })

    ## 返回年份列表和series列表
    return {'year':_yearList, 'series':_seriesList}

def main():
    ## 获取不同分支列表
    longDict=series_mod(branchName='long')
    shortDict=series_mod(branchName='short')

    ## 合并分支列表
    seriesList=longDict.get('series')+shortDict.get('series')

    ## 统计合计列表
    totalList=[round(sum(x),2) for x in list(zip(*[y.get('data') for y in seriesList]))]

    ## 合并合计列表
    seriesList.append({
        'name': totalLabel,
        'type': picType,
        'data': totalList
    })

    ## 获取年份列表
    yearList=list_uniq(longDict.get('year')+shortDict.get('year'))
    ## 获取标签
    legendList=[x.get('name') for x in seriesList]

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
