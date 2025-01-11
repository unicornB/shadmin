package server

import (
	"shadmin/adminapi"
	"shadmin/middleware"

	"github.com/gin-gonic/gin"
)

func AdminRouter(admin *gin.RouterGroup) {
	admin.POST("/login", adminapi.AdminLogin)
	admin.Use(middleware.CurrentAdmin())
	auth := admin.Group("")
	auth.Use(middleware.AuthRequired(), middleware.Logger())
	{
		auth.GET("/info", adminapi.AdminInfo)
		//菜单模块
		auth.POST("/menu/add", adminapi.SysMenuAdd)
		auth.GET("/menu/list", adminapi.SysMenuList)
		auth.PUT("/menu/update", adminapi.SysMenuUpdate)
		auth.GET("/menu/tree", adminapi.SysMenuTree)
		auth.DELETE("/menu/delete/:id", adminapi.SysMenuDelete)
		//管理员模块
		auth.GET("/admin/list", adminapi.AdminList)
		auth.POST("/admin/add", adminapi.AdminAdd)
		auth.PUT("/admin/update", adminapi.AdminUpdate)
		auth.DELETE("/admin/delete/:id", adminapi.AdminDelete)
		//角色模块
		auth.GET("/role/list", adminapi.RoleList)
		auth.POST("/role/add", adminapi.RoleAdd)
		auth.PUT("/role/update", adminapi.RoleUpdate)
		auth.DELETE("/role/delete/:id", adminapi.RoleDelete)
		auth.GET("/role/menu/:id", adminapi.SysRoleMenuGetMenusByRoleId)
		auth.GET("/role/alllist", adminapi.RoleAllList)
		//登录日志
		auth.GET("/loginlog/page", adminapi.LoginLogPage)
		auth.DELETE("/loginlog/clear", adminapi.LoginLogClear)
		//操作日志
		auth.GET("/operlog/page", adminapi.OptLogPage)
		auth.DELETE("/operlog/clear", adminapi.OptLogClear)
		//系统配置
		auth.GET("/config/page", adminapi.SysConfigPage)
		auth.POST("/config/add", adminapi.SysConfigAdd)
		auth.PUT("/config/update", adminapi.SysConfigUpdate)
		auth.DELETE("/config/delete/:id", adminapi.SysConfigDelete)

		//素材分类管理
		auth.POST("/filecate/create", adminapi.SysFileCateCreate)
		auth.PUT("/filecate/update", adminapi.SysFileCateUpdate)
		auth.DELETE("/filecate/delete/:id", adminapi.SysFileCateDelete)
		auth.GET("/filecate/list", adminapi.SysFileCateList)

	}
}
