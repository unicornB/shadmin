package adminapi

import (
	"shadmin/service"

	"github.com/gin-gonic/gin"
)

func SysMenuAdd(c *gin.Context) {
	var service service.SysMenuService
	if err := c.ShouldBind(&service); err == nil {
		res := service.SysMenuAdd(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
func SysMenuList(c *gin.Context) {
	var service service.SysMenuService
	res := service.SysMenuList(c)
	c.JSON(200, res)
}

func SysMenuUpdate(c *gin.Context) {
	var service service.SysMenuService
	if err := c.ShouldBind(&service); err == nil {
		res := service.SysMenuUpdate(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
func SysMenuTree(c *gin.Context) {
	var service service.SysMenuService
	res := service.SysMenuTree(c)
	c.JSON(200, res)
}
func SysMenuDelete(c *gin.Context) {
	var service service.SysMenuDelService
	if err := c.ShouldBindUri(&service); err == nil {
		res := service.Delete(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
func SysRoleMenuGetMenusByRoleId(c *gin.Context) {
	var service service.SysRoleMenuService
	roleId := c.Param("id")
	res := service.SysRoleMenuGetMenusByRoleId(roleId)
	c.JSON(200, res)
}
