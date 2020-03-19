# -*- coding: utf-8 -*-
"""
计划任务执行app目录下所有脚本
"""

## 调用模块
import os,sys
import logging

## 调用计划任务模块
from apscheduler.schedulers.blocking import BlockingScheduler

## 添加全局环境变量
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = nowPath
sys.path.append(homePath)

## 导入应用模块
import config
appPath = config.appPath
sys.path.append(appPath)

## 计划任务模式(堵塞方式)
scheduler = BlockingScheduler()

## 调用统一日志格式
config.logFormat

## 定义计划任务
@scheduler.scheduled_job("cron", day_of_week='*', hour='0', minute='0', second='0')
## 程序部分(该部分会执行app目录下所有脚本main模块)
def main () :
    ## 获取app下脚本列表
    fileList   = [x for x in os.listdir(appPath)]
    ## 转置为模块名称
    moduleList = [x.split('.')[0] for x in fileList if x.split('.')[-1]=='py']

    ## 依次执行对应脚本main模块
    for m in moduleList:
        ## 调用main模块命令
        importCmd   = 'from {0} import {1} as {0}'.format(m,'main')
        ## 执行main模块命令
        execCmd     = '{}()'.format(m)
        ## main模块存在日志
        existMsg    = '脚本{}.py存在, 准备运行脚本. '.format(m)
        ## main模块不存在日志
        notExistMsg = '脚本{}.py不存在'.format(m)
        ## main模块运行成功日志
        infoLog     = '脚本{}.py运行成功. '.format(m)
        ## main模块运行失败日志
        errorLog    = '脚本{}.py运行失败. '.format(m)

        try:
            exec(importCmd)
        except Exception as e:
            logging.warning(notExistMsg,e)   
        else:
            logging.info(existMsg)
            try:
                exec(execCmd)
            except Exception as e:
                logging.error(errorLog,e)
            else:
                logging.info(infoLog)

## 计划任务运行
if __name__ == '__main__':
    scheduler.start()
