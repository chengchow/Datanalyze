# -*- coding: utf-8 -*-
"""
八纵八横铁路线示意图
"""

## 调用python模块
import os,sys
import json

## 获取根目录路径, 并添加到路径变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量文件中引用相应变量
from config import chinarailway, query

## 从全局函数文件中引用相应函数
from functions import load_json_file, load_yaml_file

## 获取yaml文件数据, 并转成数组
yamlFile = chinarailway.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 获取json文件数据, 并转成数组
jsonFile = query.coordQueryFile
jsonDict = load_json_file(jsonFile)

## 主程序
def main():
    ## 从yaml数组中获取数据
    lineList  = yamlDict.get('lineList')
    titleName = yamlDict.get('titleName')

    ## 获取画图标签列表
    labelList = [ x.get('name') for x in lineList ]

    ## 获取坐标索引列表
    indexList = list(
        { z.get('name') for x in yamlDict.get('lineList') for y in x.get('value') for z in y }
    )
    ## 获取坐标列表
    axisList = [ jsonDict.get(x) for x in indexList ]
    ## 转置坐标索引和坐标列表为坐标字典
    axisDict = dict(
        zip( indexList, axisList )
    )

    ## 输出字典
    outputDict = {
        'name'  : titleName,
        'label' : labelList,
        'geo'   : axisDict,
        'data'  : lineList
    }

    ## 转json字符串
    outputStr = json.dumps(
        outputDict,
        ensure_ascii=False
    )

    ## 返回结果
    return outputStr

## 调试
if __name__=='__main__':
    print(main())
