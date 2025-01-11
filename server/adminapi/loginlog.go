package adminapi

import (
	"shadmin/service"

	"github.com/gin-gonic/gin"
)

func LoginLogPage(c *gin.Context) {
	var service service.SysLoginLogService
	if err := c.ShouldBind(&service); err == nil {
		res := service.PageList(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 清空日志
func LoginLogClear(c *gin.Context) {
	var service service.SysLoginLogService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Clear(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
