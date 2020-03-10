# 说明文档

## 运行环境：

1. nginx 1.17.3



## 项目说明：

| 目录    | 脚本                 | 说明                | 备注 |
| ------- | -------------------- | ------------------- | ---- |
| ./      |                      | 根目录              |      |
|         | index.html           | 主页                |      |
| css     |                      | css脚本路径         |      |
| img     |                      | 背景图片路径        |      |
| js      |                      | js脚本路径          |      |
| page    |                      | 副页                |      |
| scripts |                      | 其他脚本路径        |      |
|         | nginx/transport.conf | nginx配置(url)      |      |
|         | nginx/upstream.con   | nginx配置(后端分发) |      |



## 项目关联：

| 项目名称            | 数据源    | 存储方式  | 备注                       |
| :------------------ | --------- | --------- | -------------------------- |
| transport-batch     | URL       | MYSQL     | 获取数据格式化存储到数据库 |
| transport-service   | MYSQL     | URL       | 数据库数据JSON格式URL输出  |
| ***transport-web*** | ***URL*** | ***URL*** | ***获取JSON数据画图***     |

