package model //sys

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type SysAdmin struct {
	BaseModel
	Username  string  `json:"username" gorm:"comment:用户名;unique;type:varchar(50);not null"`
	RealName  string  `json:"realName" gorm:"comment:真实姓名;type:varchar(50)"`
	Password  string  `json:"password" gorm:"comment:密码;type:varchar(255);not null"`
	LoginTime XTime   `json:"loginTime" gorm:"comment:登录时间"`
	LognIp    string  `json:"loginIp" gorm:"comment:登录IP;type:varchar(20)"`
	IsAdmin   bool    `json:"isAdmin" gorm:"type:tinyint(1);comment:是否是超管 0不是 1是;default:0"`
	Status    bool    `json:"status" gorm:"type:tinyint(1);comment:状态 0禁用 1正常;default:1"`
	RoleId    uint    `json:"roleId" gorm:"comment:角色ID;type:int(11);"`
	Role      SysRole `json:"role"`
}

func (SysAdmin) TableName() string {
	return "sys_admin"
}

const (
	// PassWordCost 密码加密难度
	PassWordCost = 12
)

func (admin *SysAdmin) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(password))
	admin.SetPassword(password)
	return err == nil
}
func (admin *SysAdmin) SetPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), PassWordCost)
	if err != nil {
		return err
	}
	admin.Password = string(bytes)
	fmt.Println("密码:" + admin.Password)
	return nil
}

func GetAdmin(ID interface{}) (SysAdmin, error) {
	var admin SysAdmin
	result := DB.First(&admin, ID)
	return admin, result.Error
}
func (admin *SysAdmin) InitAdmin() {
	//判断是否有admin
	var count int64
	DB.Model(&SysAdmin{}).Count(&count)
	if count == 0 {
		//初始化管理员
		bytes, _ := bcrypt.GenerateFromPassword([]byte("123456"), PassWordCost)
		_ = DB.Create(&SysAdmin{
			Username: "admin",
			Password: string(bytes),
			IsAdmin:  true,
		}).Error
	}
}
