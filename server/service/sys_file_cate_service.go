package service

import (
	"shadmin/model"
	"shadmin/serializer"

	"github.com/gin-gonic/gin"
)

type SysFileCateService struct {
	ID   int    `json:"id"`
	Name string `json:"name" binding:"required,min=1,max=100" msg:"分类名称长度为1-100"`
	Type string `json:"type" binding:"required" msg:"分类类型不能为空"`
	Sort uint   `json:"sort"`
}

// create
func (service *SysFileCateService) Create(c *gin.Context) serializer.Response {
	var ckcate model.SysFileCate
	res := model.DB.Where("name = ?", service.Name).First(&ckcate)
	if res.RowsAffected > 0 {
		return serializer.Error("分组已存在", nil)
	}
	role := model.SysFileCate{
		Name: service.Name,
		Sort: service.Sort,
		Type: service.Type,
	}
	if err := model.DB.Create(&role).Error; err != nil {
		return serializer.Error("添加分组失败", err)
	}
	return serializer.Success("添加分组成功", nil)
}

// update
func (service *SysFileCateService) Update(c *gin.Context) serializer.Response {
	var cate model.SysFileCate
	res := model.DB.Where("id = ?", service.ID).First(&cate)
	if res.RowsAffected == 0 {
		return serializer.Error("分组不存在", nil)
	}
	cate.Name = service.Name
	cate.Sort = service.Sort
	if err := model.DB.Save(&cate).Error; err != nil {
		return serializer.Error("更新分组失败", err)
	}
	return serializer.Success("更新分组成功", nil)
}

// delete
func (service *SysFileCateService) Delete(c *gin.Context) serializer.Response {
	var cate model.SysFileCate
	res := model.DB.Where("id = ?", service.ID).First(&cate)
	if res.RowsAffected == 0 {
		return serializer.Error("分组不存在", nil)
	}
	// 判断是否有子分组
	var count int64
	model.DB.Where("parent_id = ?", service.ID).Count(&count)
	if count > 0 {
		return serializer.Error("该分组下有子分组，无法删除", nil)
	}
	//判断是否有文件
	var fileCount int64
	model.DB.Model(&model.SysFile{}).Where("cate_id = ?", service.ID).Count(&fileCount)
	if fileCount > 0 {
		return serializer.Error("该分组下有文件，无法删除", nil)
	}
	if err := model.DB.Delete(&cate).Error; err != nil {
		return serializer.Error("删除分组失败", err)
	}
	return serializer.Success("删除分组成功", nil)
}

// 所有分类
func (service *SysFileCateService) All(c *gin.Context) serializer.Response {
	var cates []model.SysFileCate
	if err := model.DB.Where("type = ?", c.Query("type")).Find(&cates).Error; err != nil {
		return serializer.Error("获取分组失败", err)
	}
	return serializer.Success("获取分组成功", cates)
}
