package adminapi

import (
	"shadmin/service"

	"github.com/gin-gonic/gin"
)

// 添加角色
func RoleAdd(c *gin.Context) {
	var service service.SysRoleService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Create(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 角色列表
func RoleList(c *gin.Context) {
	var service service.SysRoleListService
	if err := c.ShouldBind(&service); err == nil {
		res := service.PageList(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 角色更新
func RoleUpdate(c *gin.Context) {
	var service service.SysRoleService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Update(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 角色删除
func RoleDelete(c *gin.Context) {
	var service service.SysRoleService
	res := service.Delete(c)
	c.JSON(200, res)
}

// 所有角色
func RoleAllList(c *gin.Context) {
	var service service.SysRoleListService
	res := service.AllList(c)
	c.JSON(200, res)
}
