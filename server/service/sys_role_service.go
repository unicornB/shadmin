package service

import (
	"shadmin/model"
	"shadmin/serializer"
	"shadmin/util"

	"github.com/acmestack/gorm-plus/gplus"
	"github.com/gin-gonic/gin"
)

type SysRoleService struct {
	ID         uint   `json:"id" form:"id"`
	Status     bool   `json:"status"`
	Name       string `json:"name" binding:"required,min=2,max=100"`
	Sort       uint   `json:"sort" binding:"required,min=1,max=100"`
	Permission string `json:"permission" binding:"required,min=2,max=100"`
	MenuIds    []uint `json:"menuIds"`
}

// 添加角色
func (service *SysRoleService) Create(c *gin.Context) serializer.Response {
	var ckrole model.SysRole
	res := model.DB.Where("name = ?", service.Name).First(&ckrole)
	if res.RowsAffected > 0 {
		return serializer.Error("角色已存在", nil)
	}
	res1 := model.DB.Where("permission = ?", service.Permission).First(&ckrole)
	if res1.RowsAffected > 0 {
		return serializer.Error("权限已存在", nil)
	}
	role := model.SysRole{
		Name:       service.Name,
		Status:     service.Status,
		Sort:       service.Sort,
		Permission: service.Permission,
	}
	if err := model.DB.Create(&role).Error; err != nil {
		return serializer.Error("添加角色失败", err)
	}
	//添加角色菜单
	for _, v := range service.MenuIds {
		roleMenu := model.SysRoleMenu{
			RoleId: role.ID,
			MenuId: v,
		}
		model.DB.Create(&roleMenu)
	}
	return serializer.Success("添加角色成功", nil)
}

// 更新角色
func (service *SysRoleService) Update(c *gin.Context) serializer.Response {

	var role model.SysRole
	if err := model.DB.Where("id = ?", service.ID).First(&role).Error; err != nil {
		return serializer.Error("角色不存在", err)
	}
	role.Name = service.Name
	role.Status = service.Status
	role.Sort = service.Sort
	role.Permission = service.Permission
	if err := model.DB.Save(&role).Error; err != nil {
		return serializer.Error("更新角色失败", err)
	}
	//更新角色菜单
	model.DB.Where("role_id = ?", role.ID).Delete(&model.SysRoleMenu{})
	for _, v := range service.MenuIds {
		roleMenu := model.SysRoleMenu{
			RoleId: role.ID,
			MenuId: v,
		}
		model.DB.Create(&roleMenu)
	}
	return serializer.Success("更新角色成功", nil)
}

// 删除角色
func (service *SysRoleService) Delete(c *gin.Context) serializer.Response {
	roleId := c.Param("id")
	//判断管理员是否使用了该角色
	var count int64
	model.DB.Model(&model.SysAdmin{}).Where("role_id = ?", roleId).Count(&count)
	if count > 0 {
		return serializer.Error("该角色正在被使用，无法删除", nil)
	}
	model.DB.Delete(&model.SysRole{}, c.Param("id"))
	return serializer.Success("删除成功", nil)
}

type SysRoleListService struct {
	ID   uint   `json:"id"`
	Name string `json:"name" form:"name"`
}

func (service *SysRoleListService) PageList(c *gin.Context) serializer.Response {
	p := util.NewPagination(c)
	query, u := gplus.NewQuery[model.SysRole]()
	page := gplus.NewPage[model.SysRole](p.Page, p.Size)
	if service.Name != "" {
		query.Like(&u.Name, "%"+service.Name+"%")
	}
	query.OrderByAsc(&u.Sort)
	page, _ = gplus.SelectPage(page, query)
	data := map[string]interface{}{
		"page":  p.Page,
		"limit": p.Size,
		"total": page.Total,
		"list":  page.Records,
	}
	return serializer.Success("获取应用列表成功", data)
}

// 获取所有角色
func (service *SysRoleListService) AllList(c *gin.Context) serializer.Response {
	var roles []model.SysRole
	model.DB.Where("status = ? and permission != ?", 1, "admin").Find(&roles)
	return serializer.Success("成功", roles)
}
