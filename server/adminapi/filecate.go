package adminapi

import (
	"shadmin/service"

	"github.com/gin-gonic/gin"
)

// 添加文件分类接口
func SysFileCateCreate(c *gin.Context) {
	var service service.SysFileCateService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Create(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 更新文件分类接口
func SysFileCateUpdate(c *gin.Context) {
	var service service.SysFileCateService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Update(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 删除文件分类接口
func SysFileCateDelete(c *gin.Context) {
	var service service.SysFileCateService
	if err := c.ShouldBind(&service); err == nil {
		res := service.Delete(c)
		c.JSON(200, res)
	} else {
		c.JSON(200, ErrorResponse(err))
	}
}

// 获取文件分类所有列表接口
func SysFileCateList(c *gin.Context) {
	var service service.SysFileCateService
	res := service.All(c)
	c.JSON(200, res)
}
