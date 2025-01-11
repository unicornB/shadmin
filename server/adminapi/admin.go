package adminapi

import (
	"shadmin/serializer"
	"shadmin/service"

	"github.com/gin-gonic/gin"
)

func AdminLogin(c *gin.Context) {
	var service service.SysAdminLoginService
	if err := c.ShouldBind(&service); err == nil {
		res := service.SysAdminLogin(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
func AdminInfo(c *gin.Context) {
	admin := CurrentAdmin(c)
	admin.Password = "" // 不返回密码
	res := serializer.Success("", admin)
	c.JSON(200, res)
}
func AdminList(c *gin.Context) {
	var service service.SysAdminListService
	if err := c.ShouldBind(&service); err == nil {
		res := service.SysAdminList(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
func AdminAdd(c *gin.Context) {
	var service service.SysAdminService
	if err := c.ShouldBind(&service); err == nil {
		res := service.SysAdminCreate(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
func AdminUpdate(c *gin.Context) {
	var service service.SysAdminService
	if err := c.ShouldBind(&service); err == nil {
		res := service.SysAdminUpdate(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 删除管理员
func AdminDelete(c *gin.Context) {
	var service service.SysAdminService
	res := service.SysAdminDelete(c)
	c.JSON(200, res)
}
