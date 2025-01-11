package model

import "gorm.io/gorm"

type SysAdminRole struct {
	gorm.Model
	AdminId uint `gorm:"column:admin_id;type:bigint(20);comment:管理员id;not null"`
	RoleId  uint `gorm:"column:role_id;type:bigint(20);comment:角色id;not null"`
}

func (SysAdminRole) TableName() string {
	return "sys_admin_role"
}
