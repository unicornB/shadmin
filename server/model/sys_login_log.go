package model

type SysLoginLog struct {
	BaseModel
	Username   string `json:"username" gorm:"comment:用户名;type:varchar(50)"`
	Ip         string `json:"ip" gorm:"comment:登录ip;type:varchar(20)"`
	IpLocation string `json:"ipLocation" gorm:"comment:登录地点;type:varchar(100)"`
	Browser    string `json:"browser" gorm:"comment:浏览器;type:varchar(50)"`
	Os         string `json:"os" gorm:"comment:操作系统;type:varchar(50)"`
	Status     bool   `json:"status" gorm:"comment:登录状态（true成功 false失败）;type:tinyint(1);default:1"`
	Msg        string `json:"msg" gorm:"comment:提示消息;type:varchar(255)"`
}

func (SysLoginLog) TableName() string {
	return "sys_login_log"
}
