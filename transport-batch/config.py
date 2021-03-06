# -*- coding: utf-8 -*-
"""
该脚本应用用全局变量配置
"""
## 加载 python 模块
import os,sys,logging

## 设置脚本只允许调用
if __name__ == '__main__':
    print(__doc__)
    sys.exit(0)

## 获取根目录位置
nowPath  = os.path.dirname(os.path.abspath(__file__))
homePath = nowPath

## 获取全局路径
appPath = os.path.join(homePath,'app')
logPath = os.path.join(homePath,'logs')

## 项目名称
projName='transport-batch'

## 初始化日志
## 日志说明
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
logFile=os.path.join(logPath,projName+'.log')
## 日志格式
logFormat=logging.basicConfig(
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

## 存储, 查询数据库(mysql)连接信息
class mysql_conn():
    host   = 'localhost'
    user   = 'root'
    passwd = 'R00t@M2r12db'
    port   = 3306
    db     = 'datanalyze'
    tb     = 'carriage'

## 爬数据的url信息
queryUrl = 'http://data.stats.gov.cn/easyquery.htm'

## 爬数据的客户端信息
headersUserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' 

## 爬数据数据识别信息
dfwdsList = [
    '[{"wdcode":"zb","valuecode":"A0G01"}]',
    '[{"wdcode":"zb","valuecode":"A0G02"}]',
    '[{"wdcode":"zb","valuecode":"A0G04"}]',
    '[{"wdcode":"zb","valuecode":"A0G05"}]',
    '[{"wdcode":"zb","valuecode":"A0G06"}]',
    '[{"wdcode":"zb","valuecode":"A0G07"}]',
    '[{"wdcode":"zb","valuecode":"A0G08"}]',
    '[{"wdcode":"zb","valuecode":"A0G09"}]',
    '[{"wdcode":"zb","valuecode":"A0G0F"}]',
    '[{"wdcode":"zb","valuecode":"A0G0G"}]',
    '[{"wdcode":"zb","valuecode":"A0G0I"}]',
    '[{"wdcode":"zb","valuecode":"A0G0J"}]',
    '[{"wdcode":"zb","valuecode":"A0G0K"}]',
    '[{"wdcode":"zb","valuecode":"A0G0L"}]',
    '[{"wdcode":"zb","valuecode":"A0G0O"}]',
    '[{"wdcode":"zb","valuecode":"A0G0P02"}]',
    '[{"wdcode":"zb","valuecode":"A0G0P03"}]',
    '[{"wdcode":"zb","valuecode":"A0G0Q02"}]',
    '[{"wdcode":"zb","valuecode":"A0G0Q03"}]',
    '[{"wdcode":"zb","valuecode":"A0G0T"}]',
    '[{"wdcode":"zb","valuecode":"A0G0U"}]',
    '[{"wdcode":"zb","valuecode":"A0G0Z"}]'
]
