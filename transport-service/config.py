# -*- coding: utf-8 -*-
"""
全局变量设置
"""
import os
import logging

## 获取根目录位置
nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=nowPath

## 设置全局路径
appPath=os.path.join(homePath,'app')
logPath=os.path.join(homePath,'logs')
yamlPath=os.path.join(homePath, 'yaml')
queryPath=os.path.join(homePath,'query')

## 项目名称
projName='transport-service'

## 日志
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
    ## 日志级别: DEBUG, INFO, WARNNING, ERROR, CRITICAL, 默认是WARNNING
    level = logging.INFO,
    ## 日志格式: 时间, 代码所在文件名, 代码行号, 日志级别名字, 日志信息
    format = "%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s",
    ## 日志打印时间
    datefmt = "%Y/%m/%d %H:%M:%S %p",
    ## 日志目录
    filename = logFile,
    ## 打印日志方式 w 或 a
    filemode = 'a'
)

## 坐标及颜色列表查询
class query():
    coordQueryFile = os.path.join(queryPath,'coordinates.json')
    colorQueryFile = os.path.join(queryPath,'color.json')

## 查询数据库(mysql)连接信息
class mysql_conn():
    host    = 'localhost'
    user    = 'root'
    passwd  = 'R00t@M2r12db'
    port    = 3306
    db      = 'datanalyze'
    tb      = 'carriage'
    charset = 'utf8'

## 交通运输, 邮电通信业就业人员数 
class employ():
    label    = 'employ'
    yamlFile = os.path.join(yamlPath,'employ.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 运输线路长度
class lengthline():
    label    = 'lengthline'
    yamlFile = os.path.join(yamlPath,'lengthline.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None


## 货物运输平均运距
class lengthfreight():
    label    = 'lengthfreight'
    yamlFile = os.path.join(yamlPath,'lengthfreight.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 旅客运输平均运距
class lengthtraveller():
    label    = 'lengthtraveller'
    yamlFile = os.path.join(yamlPath,'lengthtraveller.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## (民用, 私人, 新注册民用, 公路营运)汽车拥有量
class motor():
    label    = 'motor'
    yamlFile = os.path.join(yamlPath,'motor.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 快递业务量
class express():
    label    = 'express'
    yamlFile = os.path.join(yamlPath,'express.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 互联网主要指标发展情况
class internet():
    peopleLabel    = 'netpeople'
    portLabel      = 'netport'
    familyLabel    ='netfamily'
    peopleYamlFile = os.path.join(yamlPath,'netpeople.yaml')
    portYamlFile   = os.path.join(yamlPath,'netport.yaml')
    familyYamlFile = os.path.join(yamlPath,'netfamily.yaml')
    host           = None
    user           = None
    passwd         = None
    port           = None
    db             = None
    tb             = None
    charset        = None

## 邮电业务量
class postal():
    label    = 'postal'
    yamlFile = os.path.join(yamlPath,'postal.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## (沿海, 内河)主要规模以上港口码头泊位数
class portberth():
    label    = 'portberth'
    yamlFile = os.path.join(yamlPath,'portberth.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 沿海主要规模以上港口货物吞吐量(取前十)
class portTEU():
    label    = 'portTEU'
    yamlFile = os.path.join(yamlPath,'portTEU.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## (沿海, 内河)主要规模以上港口码头万吨泊位数
class portWDB():
    label    = 'portWDB'
    yamlFile = os.path.join(yamlPath,'portWDB.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 国家铁路主要车站货物发送量
class railwayfreight():
    label    = 'railwayfreight'
    yamlFile = os.path.join(yamlPath,'railwayfreight.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 国家铁路主要车站旅客发送量
class railwaytraveller():
    label    = 'railwaytraveller'
    yamlFile = os.path.join(yamlPath,'railwaytraveller.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 客运量, 旅客周转量, 货运量, 货物周转量 
class traffic():
    label    = 'traffic'
    yamlFile = os.path.join(yamlPath,'traffic.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 就是一个地图
class chinamap():
    label    = 'chinamap'
    yamlFile = os.path.join(yamlPath,'chinamap.yaml')
    host     = None
    user     = None 
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 八纵八横铁路线示意图
class chinarailway():
    label    = 'chinarailway'
    yamlFile = os.path.join(yamlPath,'chinarailway.yaml')
    host     = None
    user     = None
    passwd   = None
    port     = None
    db       = None
    tb       = None
    charset  = None

## 帮助文档
if __name__ == '__main__':
    print(__doc__)
