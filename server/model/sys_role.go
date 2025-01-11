package model

type SysRole struct {
	BaseModel
	Name       string `gorm:"type:varchar(50);not null;default:'';comment:角色名称" json:"name"`
	Sort       uint   `gorm:"type:int(10) unsigned;not null;default:100;comment:排序(数字越小越靠前)" json:"sort"`
	Permission string `json:"permission" gorm:"type:varchar(100);comment:权限标识;unique"`
	Status     bool   `json:"status" gorm:"type:tinyint(1);comment:状态 0禁用 1正常;default:1"`
	Remark     string `json:"remark" gorm:"type:varchar(255);comment:备注"`
}

func (SysRole) TableName() string {
	return "sys_role"
}
func (admin *SysRole) InitRole() {
	//判断是否有admin
	var count int64
	DB.Model(&SysRole{}).Count(&count)
	if count == 0 {
		//初始化管理员
		_ = DB.Create(&SysRole{
			Name:       "超级管理员",
			Sort:       1,
			Permission: "admin",
		}).Error
	}
}
