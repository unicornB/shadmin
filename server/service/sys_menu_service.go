package service

import (
	"shadmin/model"
	"shadmin/serializer"

	"github.com/gin-gonic/gin"
)

type SysMenuService struct {
	model.SysMenu
}

// 添加菜单
func (service *SysMenuService) SysMenuAdd(c *gin.Context) serializer.Response {
	sysMenu := model.SysMenu{
		Name:       service.Name,
		Type:       service.Type,
		ParentId:   service.ParentId,
		Path:       service.Path,
		Component:  service.Component,
		Sort:       service.Sort,
		Icon:       service.Icon,
		Redirect:   service.Redirect,
		IsRoute:    service.IsRoute,
		IsMenu:     service.IsMenu,
		IsShow:     service.IsShow,
		Status:     service.Status,
		Params:     service.Params,
		Permission: service.Permission,
		Remark:     service.Remark,
	}
	if err := model.DB.Create(&sysMenu).Error; err != nil {
		return serializer.Error("添加失败", err.Error())
	}
	return serializer.Success("添加成功", nil)
}

// 查询所有菜单
func (service *SysMenuService) SysMenuList(c *gin.Context) serializer.Response {
	var sysMenus []model.SysMenu
	if err := model.DB.Where("status = ?", 1).Order("sort asc").Find(&sysMenus).Error; err != nil {
		return serializer.Error("查询失败", err.Error())
	}
	return serializer.Success("查询成功", sysMenus)
}
func (service *SysMenuService) SysMenuAll(c *gin.Context) []model.SysMenu {
	var sysMenus []model.SysMenu
	if err := model.DB.Where("status = ?", 1).Order("sort asc").Find(&sysMenus).Error; err != nil {
		return []model.SysMenu{}
	}
	return sysMenus
}

// 更新菜单
func (service *SysMenuService) SysMenuUpdate(c *gin.Context) serializer.Response {
	var sysMenu model.SysMenu
	if err := model.DB.Where("id = ?", service.ID).First(&sysMenu).Error; err != nil {
		return serializer.Error("更新失败", err.Error())
	}
	sysMenu.Name = service.Name
	sysMenu.Type = service.Type
	sysMenu.ParentId = service.ParentId
	sysMenu.Path = service.Path
	sysMenu.Component = service.Component
	sysMenu.Sort = service.Sort
	sysMenu.Icon = service.Icon
	sysMenu.Redirect = service.Redirect
	sysMenu.IsRoute = service.IsRoute
	sysMenu.IsShow = service.IsShow
	sysMenu.Status = service.Status
	sysMenu.Remark = service.Remark
	sysMenu.Permission = service.Permission
	sysMenu.Remark = service.Remark
	if err := model.DB.Save(&sysMenu).Error; err != nil {
		return serializer.Error("更新失败", err.Error())
	}
	return serializer.Success("更新成功", nil)
}

func (service *SysMenuService) SysMenuTree(c *gin.Context) []model.MenuExtend {
	var adminMenuList []model.SysMenu
	model.DB.Where("status = ?", 1).Order("sort asc").Find(&adminMenuList)
	treeData := model.GetMenuTree(adminMenuList)
	return treeData
}

// 删除菜单
type SysMenuDelService struct {
	ID uint `form:"id" json:"id" uri:"id"  binding:"required"`
}

func (service *SysMenuDelService) Delete(c *gin.Context) serializer.Response {
	//查询子菜单
	var sysMenuList []model.SysMenu
	model.DB.Where("parent_id = ?", service.ID).Find(&sysMenuList)
	if len(sysMenuList) > 0 {
		return serializer.Error("存在子菜单，无法删除", nil)
	}
	err := model.DB.Where("id = ?", service.ID).Delete(&model.SysMenu{}).Error
	if err != nil {
		return serializer.Error("删除失败", err.Error())
	}
	return serializer.Success("删除成功", nil)
}
