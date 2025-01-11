package model

type SysRoleMenu struct {
	RoleId uint `json:"roleId" gorm:"column:role_id;comment:角色id;size:20;primaryKey;autoIncrement:false;"`
	MenuId uint `json:"menuId" gorm:"column:menu_id;comment:权限id;size:20;primaryKey;autoIncrement:false;"`
}

func (SysRoleMenu) TableName() string {
	return "sys_role_menu"
}
