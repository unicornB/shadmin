package server

import (
	"shadmin/middleware"

	ginI18n "github.com/fishjar/gin-i18n"
	"github.com/gin-gonic/gin"
)

// NewRouter 路由配置
func NewRouter() *gin.Engine {
	r := gin.Default()
	// 中间件, 顺序不能改
	r.Use(middleware.Cors())
	// r.Use(middleware.CurrentAdmin())
	// apply i18n middleware
	r.Use(ginI18n.Localizer(&ginI18n.Options{
		DefaultLang:  "zh-CN",       // default language
		SupportLangs: "zh-CN,en-US", // list of supported languages ​​(must include default language)
		FilePath:     "localize",    // multilingual file directory
	}))
	admin := r.Group("/admin")
	AdminRouter(admin)
	// {
	// 	admin.POST("/login", adminapi.AdminLogin)
	// 	auth := admin.Group("")
	// 	auth.Use(middleware.AuthRequired())
	// 	{
	// 		admin.GET("/info", adminapi.AdminInfo)
	// 		//菜单模块
	// 		admin.GET("/menu/add", adminapi.SysMenuAdd)
	// 	}
	// }
	return r
}
