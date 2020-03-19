# -*- coding: utf-8 -*-
"""
中国地图
"""

## 调用python模块
import os,sys
import json

## 获取根目录路径, 并添加到路径变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = os.path.join(nowPath,'../')
sys.path.append(homePath)

## 从全局变量文件中引用相应变量
from config import chinamap,query

## 从全局函数文件中引用相应函数
from functions import load_json_file,load_yaml_file

## 读取yaml文件数据, 转成数组格式
yamlFile = chinamap.yamlFile
yamlDict = load_yaml_file(yamlFile)

## 读取json文件数据，转成数组格式
jsonFile = query.coordQueryFile
jsonDict = load_json_file(jsonFile)

## 主程序
def main():
    ## 从yaml数组中获取变量
    lineList = yamlDict.get('lineList')

    ## 获取坐标索引列表
    indexList = list(
        {y.get('name') for x in lineList for y in x}
    )
    ## 获取坐标列表
    axisList = [ jsonDict.get(x) for x in indexList ]

    ## 转置坐标索引和坐标列表为坐标字典格式
    axisDict = dict(
        zip(indexList,axisList)
    )

    ## 输出字典
    outputDict = {
        'axis'  : axisDict,
        'value' : lineList
    }

    ## 转json字符串
    outputStr = json.dumps(
        outputDict,
        ensure_ascii = False
    )

    ## 返回结果
    return outputStr

## 调试
if __name__ == '__main__':
    print(main())
