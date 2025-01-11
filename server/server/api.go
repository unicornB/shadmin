package server

import (
	"shadmin/adminapi"
	"shadmin/middleware"

	"github.com/gin-gonic/gin"
)

func ApiRouter(admin *gin.RouterGroup) {
	admin.POST("/login", adminapi.AdminLogin)
	auth := admin.Group("")
	auth.Use(middleware.AuthRequired())
	{
		admin.GET("/info", adminapi.AdminInfo)
		//菜单模块
		admin.GET("/menu/add", adminapi.SysMenuAdd)
	}
}
