package conf

import (
	"fmt"
	"os"
	"shadmin/cache"
	"shadmin/model"
	"shadmin/util"

	"github.com/joho/godotenv"
)

// Init 初始化配置项
func Init() {
	fmt.Println("初始化配置项")
	// 从本地读取环境变量
	godotenv.Load()
	InitLogger()
	// 设置日志级别
	//util.BuildLogger(os.Getenv("LOG_LEVEL"))

	// 读取翻译文件
	if err := LoadLocales("conf/locales/zh-cn.yaml"); err != nil {
		util.Log().Panic("翻译文件加载失败", err)
	}
	fmt.Println("翻译文件加载成功")
	// 连接数据库
	model.Database(os.Getenv("MYSQL_DSN"))
	cache.Redis()
}
