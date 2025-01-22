package adminapi

import (
	"shadmin/service"

	"github.com/gin-gonic/gin"
)

func SysUploadFile(c *gin.Context) {
	var service service.SysUploadService
	res := service.SysUploadBacked(c)
	c.JSON(200, res)
}
func SysUploadVideo(c *gin.Context) {
	var service service.SysUploadService
	res := service.SysUploadBackedVideo(c)
	c.JSON(200, res)
}
