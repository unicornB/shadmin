package service

import (
	"shadmin/model"
	"shadmin/serializer"
)

type SysRoleMenuService struct {
}

// SysRoleMenuGetMenusByRoleId 根据角色id获取菜单
func (s *SysRoleMenuService) SysRoleMenuGetMenusByRoleId(roleId string) serializer.Response {
	// TODO: 根据角色id获取菜单
	var sysRoleList []model.SysRoleMenu
	model.DB.Where("role_id = ?", roleId).Find(&sysRoleList)
	return serializer.Success("获取成功", sysRoleList)
}

// 获取当前角色的接口权限
func (s *SysRoleMenuService) SysRoleMenuGetMenusPermByRoleId(roleId uint, isAdmin bool) []string {
	if isAdmin {
		var sysMenuList []model.SysMenu
		model.DB.Where("type = 4").Find(&sysMenuList)
		var perms []string
		for _, v := range sysMenuList {
			perms = append(perms, v.Path)
		}
		return perms
	}
	var sysRoleList []model.SysRoleMenu
	model.DB.Where("role_id = ?", roleId).Find(&sysRoleList)
	var ids []uint
	for _, v := range sysRoleList {
		ids = append(ids, v.MenuId)
	}
	var sysMenuList []model.SysMenu
	model.DB.Where("id in (?) and type = 4", ids).Find(&sysMenuList)
	var perms []string
	for _, v := range sysMenuList {
		perms = append(perms, v.Path)
	}
	return perms
}
