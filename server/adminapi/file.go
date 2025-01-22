package adminapi

import (
	"shadmin/service"

	"github.com/gin-gonic/gin"
)

func SysFilePage(c *gin.Context) {
	var service service.SysFileService
	if err := c.ShouldBind(&service); err == nil {
		res := service.PageList(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
func SysFileReFileName(c *gin.Context) {
	var service service.SysFileService
	if err := c.ShouldBind(&service); err == nil {
		res := service.ReFileName(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
func SysFileMove(c *gin.Context) {
	var service service.SysFileService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Move(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
func SysFileDelete(c *gin.Context) {
	var service service.SysFileService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Delete(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}
