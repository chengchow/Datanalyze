# 说明文档

## 运行环境：

1. python 3.7.3



## 项目说明：

| 目录    | 脚本                   | 说明           | 备注                                                         |
| ------- | ---------------------- | -------------- | ------------------------------------------------------------ |
| ./      |                        | 根目录         |                                                              |
|         | run.py                 | 启动脚本       |                                                              |
|         | run.conf               | 配置文件       | 支持gunicorn启动                                             |
|         | config.py              | 全局变量       |                                                              |
|         | functions.py           | 全局函数       |                                                              |
|         | requirements.txt       | python依赖表   | sudo pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/ |
| logs    |                        | 日志路径       |                                                              |
| scripts |                        | 其他脚本路径   |                                                              |
|         | daemon/monitor-service | 开机启动脚本   | 支持chkconfig管理                                            |
|         | other/run.sh           | 创建run.py脚本 |                                                              |



## 项目关联：

| 项目名称              | 数据源      | 存储方式  | 备注                            |
| :-------------------- | ----------- | --------- | ------------------------------- |
| monitor-batch         | Zabbix_DB   | MYSQL     | 获取数据格式化存储到数据库      |
| ***monitor-service*** | ***MYSQL*** | ***URL*** | ***数据库数据JSON格式URL输出*** |
| monitor-web           | URL         | URL       | 获取JSON数据画图                |

