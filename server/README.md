# shadmin
go mod tidy
shadmin: Simple Single Golang Web Service

go-crud正式改名为shadmin!

使用shadmin开发Web服务: 用最简单的架构，实现够用的框架，服务海量用户

https://github.com/Gourouting/shadmin
## 未完成功能
1.参数签名
2.敏感数据加密
3.redis缓存
4.接口权限控制
5.zap日志
## 更新日志

1.已支持接口测试
2.已经支持go1.20，请安装这个版本的golang使用本项目

## 视频实况教程

[让我们写个G站吧！Golang全栈编程实况](https://space.bilibili.com/10/channel/detail?cid=78794)

## 使用shadmin开发的项目实例

仿B站的G站：https://github.com/Gourouting/giligili

shadmin框架为移动端提供Token登录的案例: https://github.com/bydmm/shadmin-token-exmaple
## 目的

本项目采用了一系列Golang中比较流行的组件，可以以本项目为基础快速搭建Restful Web API

## 特色

本项目已经整合了许多开发API所必要的组件：

1. [Gin](https://github.com/gin-gonic/gin): 轻量级Web框架，自称路由速度是golang最快的 
2. [GORM](https://gorm.io/index.html): ORM工具。本项目需要配合Mysql使用 
3. [Gin-Session](https://github.com/gin-contrib/sessions): Gin框架提供的Session操作工具
4. [Go-Redis](https://github.com/go-redis/redis): Golang Redis客户端
5. [godotenv](https://github.com/joho/godotenv): 开发环境下的环境变量工具，方便使用环境变量
6. [Gin-Cors](https://github.com/gin-contrib/cors): Gin框架提供的跨域中间件
7. [httpexpect](https://github.com/gavv/httpexpect): 接口测试工具
8. 自行实现了国际化i18n的一些基本功能
9. 本项目是使用基于cookie实现的session来保存登录状态的，如果需要可以自行修改为token验证

本项目已经预先实现了一些常用的代码方便参考和复用:

1. 创建了用户模型
2. 实现了```/api/v1/user/register```用户注册接口
3. 实现了```/api/v1/user/login```用户登录接口
4. 实现了```/api/v1/user/me```用户资料接口(需要登录后获取session)
5. 实现了```/api/v1/user/logout```用户登出接口(需要登录后获取session)

本项目已经预先创建了一系列文件夹划分出下列模块:

1. api文件夹就是MVC框架的controller，负责协调各部件完成任务
2. model文件夹负责存储数据库模型和数据库操作相关的代码
3. service负责处理比较复杂的业务，把业务代码模型化可以有效提高业务代码的质量（比如用户注册，充值，下单等）
4. serializer储存通用的json模型，把model得到的数据库模型转换成api需要的json对象
5. cache负责redis缓存相关的代码
6. auth权限控制文件夹
7. util一些通用的小工具
8. conf放一些静态存放的配置文件，其中locales内放置翻译相关的配置文件

## Godotenv

项目在启动的时候依赖以下环境变量，但是在也可以在项目根目录创建.env文件设置环境变量便于使用(建议开发环境使用)

```shell
MYSQL_DSN="db_user:db_password@/db_name?charset=utf8&parseTime=True&loc=Local" # Mysql连接地址
REDIS_ADDR="127.0.0.1:6379" # Redis端口和地址
REDIS_PW="" # Redis连接密码
REDIS_DB="" # Redis库从0到10
SESSION_SECRET="setOnProducation" # Seesion密钥，必须设置而且不要泄露
GIN_MODE="debug"
```

## Go Mod

本项目使用[Go Mod](https://github.com/golang/go/wiki/Modules)管理依赖。

```shell
go mod init shadmin
export GOPROXY=http://mirrors.aliyun.com/goproxy/
go run main.go // 自动安装
```

## 运行

```shell
go run main.go
```

项目运行后启动在3000端口（可以修改，参考gin文档)

## 接口测试
【新】本项目内置了接口测试的内容

#### 使用方法
0. 确保自己在项目根目录下
1. 在test目录下创建test专用的环境变量文件

```
cp test/.env.example test/.env
```

2. 修改```test/.env```文件内容里的环境变量，保证可以正常连接mysql/redis
3. 在项目根目录执行测试，并开启```-v```检查下测试是否在正确运行

```
go test -v ./test
```

4. 确保测试可正确运行后，后续去掉-v参数，查看测试是否通过
```
go test ./test
ok      shadmin/test      (cached)
```

打包
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o shadmin main.go