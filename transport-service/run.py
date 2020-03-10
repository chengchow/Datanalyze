# -*- coding: utf-8 -*-
"""
定时处理hive数据，结果输出到mysql
"""

## 添加全局变量及函数
import os,sys
import logging
from flask import Flask

nowPath=os.path.dirname(os.path.abspath(__file__))
homePath=nowPath
sys.path.append(homePath)

## 引入全局变量
from config import appPath,logFormat
sys.path.append(appPath)

## 调用日志格式
logFormat

app=Flask(__name__)

@app.route("/transport/json/chinamap")
def chinamap_mod():
    try:
        from chinamap import main as chinamap
    except Exception as e:
        logging.warning('chinamap.py脚本不存在, 或者chinamap.py脚本不存在main模块 ')
    else:
        try:
            optInfo=chinamap()
        except Exception as e:
            logging.error('获取chinamap数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/chinarailway")
def chinarailway_mod():
    try:
        from chinarailway import main as chinarailway
    except Exception as e:
        logging.warning('chinarailway.py脚本不存在, 或者chinarailway.py脚本不存在main模块 ')
    else:
        try:
            optInfo=chinarailway()
        except Exception as e:
            logging.error('获取chinarailway数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/employ")
def employ_mod():
    try:
        from employ import main as employ
    except Exception as e:
        logging.warning('employ.py脚本不存在, 或者employ.py脚本不存在main模块 ')
    else:
        try:
            optInfo=employ()
        except Exception as e:
            logging.error('获取employ数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/express")
def express_mod():
    try:
        from express import main as express
    except Exception as e:
        logging.warning('express.py脚本不存在, 或者express.py脚本不存在main模块 ')
    else:
        try:
            optInfo=express()
        except Exception as e:
            logging.error('获取express数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/lengthfreight")
def lengthfreight_mod():
    try:
        from lengthfreight import main as lengthfreight
    except Exception as e:
        logging.warning('lengthfreight.py脚本不存在, 或者lengthfreight.py脚本不存在main模块 ')
    else:
        try:
            optInfo=lengthfreight()
        except Exception as e:
            logging.error('获取lengthfreight数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/lengthline")
def lengthline_mod():
    try:
        from lengthline import main as lengthline
    except Exception as e:
        logging.warning('lengthline.py脚本不存在, 或者lengthline.py脚本不存在main模块 ')
    else:
        try:
            optInfo=lengthline()
        except Exception as e:
            logging.error('获取lengthline数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/lengthtraveller")
def lengthtraveller_mod():
    try:
        from lengthtraveller import main as lengthtraveller
    except Exception as e:
        logging.warning('lengthtraveller.py脚本不存在, 或者lengthtraveller.py脚本不存在main模块 ')
    else:
        try:
            optInfo=lengthtraveller()
        except Exception as e:
            logging.error('获取lengthtraveller数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/motor")
def motor_mod():
    try:
        from motor import main as motor
    except Exception as e:
        logging.warning('motor.py脚本不存在, 或者motor.py脚本不存在main模块 ')
    else:
        try:
            optInfo=motor()
        except Exception as e:
            logging.error('获取motor数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/netfamily")
def netfamily_mod():
    try:
        from netfamily import main as netfamily
    except Exception as e:
        logging.warning('netfamily.py脚本不存在, 或者netfamily.py脚本不存在main模块 ')
    else:
        try:
            optInfo=netfamily()
        except Exception as e:
            logging.error('获取netfamily数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/netpeople")
def netpeople_mod():
    try:
        from netpeople import main as netpeople
    except Exception as e:
        logging.warning('netpeople.py脚本不存在, 或者netpeople.py脚本不存在main模块 ')
    else:
        try:
            optInfo=netpeople()
        except Exception as e:
            logging.error('获取netpeople数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/netport")
def netport_mod():
    try:
        from netport import main as netport
    except Exception as e:
        logging.warning('netport.py脚本不存在, 或者netport.py脚本不存在main模块 ')
    else:
        try:
            optInfo=netport()
        except Exception as e:
            logging.error('获取netport数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/portberth")
def portberth_mod():
    try:
        from portberth import main as portberth
    except Exception as e:
        logging.warning('portberth.py脚本不存在, 或者portberth.py脚本不存在main模块 ')
    else:
        try:
            optInfo=portberth()
        except Exception as e:
            logging.error('获取portberth数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/portTEU")
def portTEU_mod():
    try:
        from portTEU import main as portTEU
    except Exception as e:
        logging.warning('portTEU.py脚本不存在, 或者portTEU.py脚本不存在main模块 ')
    else:
        try:
            optInfo=portTEU()
        except Exception as e:
            logging.error('获取portTEU数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/portWDB")
def portWDB_mod():
    try:
        from portWDB import main as portWDB
    except Exception as e:
        logging.warning('portWDB.py脚本不存在, 或者portWDB.py脚本不存在main模块 ')
    else:
        try:
            optInfo=portWDB()
        except Exception as e:
            logging.error('获取portWDB数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/postal")
def postal_mod():
    try:
        from postal import main as postal
    except Exception as e:
        logging.warning('postal.py脚本不存在, 或者postal.py脚本不存在main模块 ')
    else:
        try:
            optInfo=postal()
        except Exception as e:
            logging.error('获取postal数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/railwayfreight")
def railwayfreight_mod():
    try:
        from railwayfreight import main as railwayfreight
    except Exception as e:
        logging.warning('railwayfreight.py脚本不存在, 或者railwayfreight.py脚本不存在main模块 ')
    else:
        try:
            optInfo=railwayfreight()
        except Exception as e:
            logging.error('获取railwayfreight数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/railwaytraveller")
def railwaytraveller_mod():
    try:
        from railwaytraveller import main as railwaytraveller
    except Exception as e:
        logging.warning('railwaytraveller.py脚本不存在, 或者railwaytraveller.py脚本不存在main模块 ')
    else:
        try:
            optInfo=railwaytraveller()
        except Exception as e:
            logging.error('获取railwaytraveller数据失败!  ')
        else:
            return optInfo

@app.route("/transport/json/traffic")
def traffic_mod():
    try:
        from traffic import main as traffic
    except Exception as e:
        logging.warning('traffic.py脚本不存在, 或者traffic.py脚本不存在main模块 ')
    else:
        try:
            optInfo=traffic()
        except Exception as e:
            logging.error('获取traffic数据失败!  ')
        else:
            return optInfo

if __name__ == '__main__':
#    app.run(debug=False)
    app.run(debug=False, port=10166, host='192.168.254.20')
