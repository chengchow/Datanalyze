# -*- coding: utf-8 -*-
"""
该脚本应用用全局变量配置
"""
## 调用python模块
import os,sys
import logging

## 禁止本地运行
if __name__ == '__main__':
    print(__doc__)
    sys.exit(0)

## 获取根目录
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = nowPath

## 配置全局路径
appPath   = os.path.join(homePath,'app')         ## 应用路径
logPath   = os.path.join(homePath,'logs')        ## 日志路径
queryPath = os.path.join(homePath,'query')       ## 坐标及色彩查询路径
yamlPath  = os.path.join(homePath,'yaml')        ## 画图数据路径

## 日志格式说明
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


## 日志文件
logFile = os.path.join(logPath, 'monitor-batch.log')

## 配置日志格式
logFormat = logging.basicConfig(
    ## 日志级别: DEBUG, INFO, WARNING, ERROR, CRITICAL, 默认是WARNNING
    level    = logging.INFO,
    ## 日志格式: 时间, 代码所在文件名, 代码行号, 日志级别名字, 日志信息
    format   = "%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s",
    ## 日志打印时间
    datefmt  = "%Y/%m/%d %H:%M:%S %p",
    ## 日志目录
    filename = logFile,
    ## 打印日志方式 w 或 a
    filemode = 'a'
)

## 查询类变量
class query():
    axisFile  = os.path.join(queryPath,'axis.json')
    colorFile = os.path.join(queryPath,'color.json')

## 数据库(Mysql)连接信息

## 本地存储库连接信息(读写)
class mysql_conn():
    host   = 'localhost'
    user   = 'root'
    passwd = 'R00t@M2r12db'
    port   = 3306
    db     = 'datanalyze'
    tb     = 'monitor'
    sltSQL = "SELECT name FROM {}.{} WHERE name='{}'" 
    istSQL = "INSERT INTO {}.{} values ('{}','{}',{})"
    uptSQL = "UPDATE {}.{} SET data='{}', unixtime={} WHERE name='{}'"

## Zabbix数据库连接信息(只读)
class zbxdb_conn():
    host   = '192.168.1.228'
    user   = 'zbxread'
    passwd = 'Zbxr92d@U9np2y*c0m'
    port   = 3306
    db     = 'zabbix'
    tb     = 'events'

## 主机位置数量地图变量信息
class hostmap():
    label    = 'hostmap'
    yamlFile = os.path.join(yamlPath,'hostmap.yaml')
    querySQL = 'SELECT COUNT(hostid) AS result FROM {}.{} WHERE groupid={}'

## 历史事务趋势变量信息
class event():
    label    = 'event'
    yamlFile = os.path.join(yamlPath,'event.yaml')
    querySQL = 'SELECT COUNT(eventid) AS result FROM {}.{}     \
                WHERE source=0 AND object=0 AND severity {} {} \
                AND clock >={} AND clock <{}'

## 平均负载历史趋势变量信息
class loadavg():
    label    = 'loadavg'
    yamlFile = os.path.join(yamlPath,'loadavg.yaml')
    querySQL = 'SELECT COUNT(eventid) AS result FROM {}.{}     \
                WHERE source=0 AND object=0 AND severity {} {} \
                AND clock >= {} AND clock < {} AND name LIKE "%平均负载%"'

## 本月端口连接超时比例变量信息
class nowport():
    label     = 'nowport'
    yamlFile  = os.path.join(yamlPath,'nowport.yaml')
    querySQL  = 'SELECT COUNT(eventid) AS result FROM {}.{}     \
                 WHERE source=0 AND object=0 AND severity {} {} \
                 AND clock >= {} AND name LIKE "%{}%"'

## 本月事务触发比例变量信息
class nowevent():
    label    = 'nowevent'
    yamlFile = os.path.join(yamlPath,'nowevent.yaml')
    querySQL = 'SELECT count(eventid) AS result FROM {}.{}      \
                WHERE source=0 AND object=0 AND severity {} {}  \
                AND clock >= {}'
## 端口超时触发历史趋势变量信息
class port():
    label    = 'port'
    yamlFile = os.path.join(yamlPath,'port.yaml')
    querySQL = 'SELECT COUNT(eventid) AS result FROM {}.{}      \
                WHERE source=0 AND object=0 AND severity {} {}  \
                AND clock >= {} AND clock < {} AND name LIKE "%{}%"'

## 本月端口超时前十示意图变量信息
class nowport10():
    label    = 'nowport10'
    yamlFile = os.path.join(yamlPath,'nowport10.yaml')
    querySQL = 'SELECT name,COUNT(eventid) AS result FROM {}.{}  \
                WHERE source=0 AND object=0 AND severity!=0      \
                AND clock >= {} AND name LIKE "%{}%"             \
                GROUP BY name ORDER BY result DESC LIMIT 10'
## 历史端口超时前十示意图变量信息
class port10():
    label    = 'port10'
    yamlFile = os.path.join(yamlPath,'port10.yaml')
    querySQL = 'SELECT name,COUNT(eventid) AS result FROM {}.{}  \
                WHERE source=0 AND object=0 AND severity!=0      \
                AND name LIKE "%{}%"                             \
                GROUP BY name ORDER BY result DESC LIMIT 10'
## 磁盘容量触发历史趋势变量信息
class disk():
    label    = 'disk'
    yamlFile = os.path.join(yamlPath,'disk.yaml')
    querySQL = 'SELECT COUNT(eventid) AS result FROM {}.{}       \
                WHERE source=0 AND object=0 AND severity {} {}   \
                AND clock >= {} AND clock < {} AND name LIKE "%{}%"'
