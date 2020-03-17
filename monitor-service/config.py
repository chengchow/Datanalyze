# -*- coding: utf-8 -*-
"""
全局变量设置
"""
import os
import logging

## 全局变量
nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=nowPath

appPath=os.path.join(homePath,'app')
logPath=os.path.join(homePath,'logs')

## 初始化日志
"""
format: 指定输出的格式和内容，format可以输出很多有用信息，如上例所示:
    %(levelno)s: 打印日志级别的数值
    %(levelname)s: 打印日志级别名称
    %(pathname)s: 打印当前执行程序的路径，其实就是sys.argv[0]
    %(filename)s: 打印当前执行程序名
    %(funcName)s: 打印日志的当前函数
    %(lineno)d: 打印日志的当前行号
    %(asctime)s: 打印日志的时间
    %(thread)d: 打印线程ID
    %(threadName)s: 打印线程名称
    %(process)d: 打印进程ID
    %(message)s: 打印日志信息
"""
logFormat=logging.basicConfig(
    ## 日志级别: DEBUG, INFO, WARNNING, ERROR, CRITICAL, 默认是WARNNING
    level = logging.INFO,
    ## 日志格式: 时间, 代码所在文件名, 代码行号, 日志级别名字, 日志信息
    format = "%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s",
    ## 日志打印时间
    datefmt = "%Y/%m/%d %H:%M:%S %p",
    ## 日志目录
    filename = nowPath+"/logs/transport-service.log",
    ## 打印日志方式 w 或 a
    filemode = 'a'
)

## mysql连接
class mysql_conn():
    host='localhost'
    user='root'
    passwd='R00t@M2r12db'
    port=3306
    sltSQL="SELECT name,data FROM datanalyze.monitor where name='{}'"

class hostmap():
    label='hostmap'

class event():
    label='event'

class loadavg():
    label='loadavg'

class nowport():
    label='nowport'

class nowevent():
    label='nowevent'

class port():
    label='port'

class nowport10():
    label='nowport10'

class port10():
    label='port10'

class disk():
    label='disk'

## 调试
if __name__ == '__main__':
    print(__doc__)
