# 说明文档

## 运行环境：

1. Python 3.7.3
2. MariaDB 5.5.60



## 项目说明：

| 目录    | 脚本                 | 说明         | 备注                                                         |
| ------- | -------------------- | ------------ | ------------------------------------------------------------ |
| ./      |                      | 根目录       |                                                              |
|         | run.py               | 启动脚本     |                                                              |
|         | config.py            | 全局变量     |                                                              |
|         | functions.py         | 全局函数     |                                                              |
|         | requirements.txt     | python依赖表 | sudo pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/ |
| query   |                      | 查询目录     |                                                              |
| app     |                      | 项目脚本路径 |                                                              |
| logs    |                      | 日志路径     |                                                              |
| scripts |                      | 其他脚本路径 |                                                              |
|         | daemon/monitor-batch | 开机启动脚本 | 支持chkconfig管理                                            |



## 项目关联：

| 项目名称         | 数据源          | 存储方式    | 备注                             |
| :--------------- | --------------- | ----------- | -------------------------------- |
| monitor-batch*** | ***Zabbix_DB*** | ***MYSQL*** | ***获取数据格式化存储到数据库*** |
| monitor-service  | MYSQL           | URL         | 数据库数据JSON格式URL输出        |
| monitor-web      | URL             | URL         | 获取JSON数据画图                 |

