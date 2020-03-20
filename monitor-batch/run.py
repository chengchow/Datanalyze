# -*- coding: utf-8 -*-
"""
计划任务执行app目录下所有脚本
"""

## 调用python模块
import os,sys
import logging

## 从计划任务模块中调用堵塞模式
from apscheduler.schedulers.blocking import BlockingScheduler

## 获取根目录, 并添加到全局环境变量中
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = nowPath
sys.path.append(homePath)

## 从全局变量文件总引用相应变量
from config import logFormat, appPath

## 追加app路径到全局环境变量中
sys.path.append(appPath)

## 指定计划任务模式
scheduler = BlockingScheduler()

## 指定日志格式
logFormat

## 定义计划任务运行频率
@scheduler.scheduled_job("cron", day_of_week = '*', hour = '0', minute = '0', second = '0')

## 程序部分(该部分会执行app目录下所有py脚本)
def main () :
    ## 获取app下脚本所有python脚本
    fileList = [ x for x in os.listdir(appPath) ]
    ## 修正脚本列表为模块列表
    moduleList = [ x.split('.')[0] for x in fileList if x.split('.')[-1] == 'py' ]

    ## 轮询执行模块列表模块
    for m in moduleList:
        ## 从对应模块中引用主函数命令
        importCmd   = 'from {0} import {1} as {0}'.format(m,'main')
        ## 执行对应主函数命令
        execCmd     = '{}()'.format(m)
        ## 模块存在通知信息
        existMsg    = '脚本{}.py存在, 准备运行脚本. '.format(m)
        ## 模块不存在错误信息
        notExistMsg = '脚本{}.py不存在'.format(m)
        ## 模块数据返回成功通知信息
        infoLog     = '脚本{}.py运行成功. '.format(m)
        ## 模块数据返回失败错误信息
        errorLog    = '脚本{}.py运行失败. '.format(m)

        try:
            exec(importCmd)
        except Exception as e:
            logging.error(notExistMsg, e)
        else:
            logging.info(existMsg)
            try:
                exec(execCmd)
            except Exception as e:
                logging.error(errorLog, e)
            else:
                logging.info(infoLog)

## 运行计划任务
if __name__ == '__main__':
    scheduler.start()
