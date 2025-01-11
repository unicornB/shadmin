package adminapi

import (
	"shadmin/service"

	"github.com/gin-gonic/gin"
)

// 添加系统配置
func SysConfigAdd(c *gin.Context) {
	var service service.SysConfigService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Create(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 更新系统配置
func SysConfigUpdate(c *gin.Context) {
	var service service.SysConfigService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Update(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 删除系统配置
func SysConfigDelete(c *gin.Context) {
	var service service.SysConfigService
	res := service.Delete(c)
	c.JSON(200, res)
}

// 系统配置列表
func SysConfigPage(c *gin.Context) {
	var service service.SysConfigListSerivce
	if err := c.ShouldBind(&service); err == nil {
		res := service.PageList(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
