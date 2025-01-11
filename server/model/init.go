package model

import (
	"fmt"
	"log"
	"os"
	"shadmin/util"
	"time"

	"github.com/acmestack/gorm-plus/gplus"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB 数据库链接单例
var DB *gorm.DB

// Database 在中间件中初始化mysql链接
func Database(connString string) {
	fmt.Println("Database init...")
	// 初始化GORM日志配置
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second, // Slow SQL threshold
			LogLevel:                  logger.Info, // Log level(这里记得根据需求改一下)
			IgnoreRecordNotFoundError: true,        // Ignore ErrRecordNotFound error for logger
			Colorful:                  false,       // Disable color
		},
	)
	fmt.Println("sqllite connecting")
	//conf.Logger.Info("sqllite connecting")
	db, err := gorm.Open(mysql.Open(connString), &gorm.Config{
		Logger: newLogger,
	})
	// Error
	if connString == "" || err != nil {
		//conf.Logger.Sugar().Errorf("sqllite lost: %v", err.Error())
		util.Log().Error("sqllite lost: %v", err)
		panic(err)
	}
	fmt.Println("sqllite connected")
	DB = db
	migration()
	// 初始化gplus
	gplus.Init(DB)
	var admin SysAdmin
	admin.InitAdmin()
	var role SysRole
	role.InitRole()
}
