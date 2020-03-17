# -*- coding: utf-8 -*-
"""
该脚本应用用全局变量配置
"""
## 加载模块
import os,sys,logging

## 该脚本只能被调用
if __name__ == '__main__':
    print(__doc__)
    sys.exit(0)

## 全局变量
nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=nowPath

## 全局路径
appPath=os.path.join(homePath,'app')
logPath=os.path.join(homePath,'logs')
queryPath=os.path.join(homePath,'query')
yamlPath=os.path.join(homePath,'yaml')

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

## 指定统一日志格式
logFormat=logging.basicConfig(
    ## 日志级别: DEBUG, INFO, WARNING, ERROR, CRITICAL, 默认是WARNNING
    level = logging.INFO,
    ## 日志格式: 时间, 代码所在文件名, 代码行号, 日志级别名字, 日志信息
    format = "%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s",
    ## 日志打印时间
    datefmt = "%Y/%m/%d %H:%M:%S %p",
    ## 日志目录
    filename = nowPath+"/logs/transport-batch.log",
    ## 打印日志方式 w 或 a
    filemode = 'a'
)

class query():
    axisFile=os.path.join(queryPath,'axis.json')
    colorFile=os.path.join(queryPath,'color.json')

## mysql连接
## 存储数据库连接信息
class mysql_conn():
    host='localhost'
    user='root'
    passwd='R00t@M2r12db'
    port=3306
    db='datanalyze'
    tb='monitor'
    sltSQL="SELECT name FROM {}.{} WHERE name='{}'" 
    istSQL="INSERT INTO {}.{} values ('{}','{}',{})"
    uptSQL="UPDATE {}.{} SET data='{}', unixtime={} where name='{}'"

class zbxdb_conn():
    host='192.168.1.228'
    user='zbxread'
    passwd='Zbxr92d@U9np2y*c0m'
    port=3306
    db='zabbix'
    tb='events'

class hostmap():
    label='hostmap'
    yamlFile=os.path.join(yamlPath,'hostmap.yaml')
    querySQL='SELECT COUNT(hostid) AS result FROM {}.{} WHERE groupid={}'

class event():
    label='event'
    yamlFile=os.path.join(yamlPath,'event.yaml')
    querySQL='SELECT COUNT(eventid) AS result FROM {}.{} WHERE source=0 AND object=0 AND severity {} {} AND clock >={} AND clock <{}'

class loadavg():
    label='loadavg'
    yamlFile=os.path.join(yamlPath,'loadavg.yaml')
    querySQL='SELECT COUNT(eventid) AS result FROM {}.{} WHERE source=0 AND object=0 AND severity {} {} AND clock >= {} AND clock < {} AND name LIKE "%平均负载%"'

class nowport():
    label='nowport'
    yamlFile=os.path.join(yamlPath,'nowport.yaml')
    querySQL='SELECT COUNT(eventid) AS result FROM {}.{} WHERE source=0 AND object=0 AND severity {} {} AND clock >= {} AND name LIKE "%{}%"'

class nowevent():
    label='nowevent'
    yamlFile=os.path.join(yamlPath,'nowevent.yaml')
    querySQL='SELECT count(eventid) AS result FROM {}.{} WHERE source=0 AND object=0 AND severity {} {} AND clock >= {}'

class port():
    label='port'
    yamlFile=os.path.join(yamlPath,'port.yaml')
    querySQL='SELECT COUNT(eventid) AS result FROM {}.{} WHERE source=0 AND object=0 AND severity {} {} AND clock >= {} AND clock < {} AND name LIKE "%{}%"'

class nowport10():
    label='nowport10'
    yamlFile=os.path.join(yamlPath,'nowport10.yaml')
    querySQL='SELECT name,COUNT(eventid) AS result FROM {}.{} WHERE source=0 AND object=0 AND severity!=0 AND clock >= {} AND name LIKE "%{}%" GROUP BY name ORDER BY result DESC LIMIT 10'

class port10():
    label='port10'
    yamlFile=os.path.join(yamlPath,'port10.yaml')
    querySQL='SELECT name,COUNT(eventid) AS result FROM {}.{} WHERE source=0 AND object=0 AND severity!=0 AND name LIKE "%{}%" GROUP BY name ORDER BY result DESC LIMIT 10'

class disk():
    label='disk'
    yamlFile=os.path.join(yamlPath,'disk.yaml')
    querySQL='SELECT COUNT(eventid) AS result FROM {}.{} WHERE source=0 AND object=0 AND severity {} {} AND clock >= {} AND clock < {} AND name LIKE "%{}%"'
