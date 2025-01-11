package model

type SysOptLog struct {
	BaseModel
	OptMethod string `json:"optMethod" form:"optMethod" gorm:"comment:请求方法;type:varchar(30);"`
	OptModule string `json:"optModule" form:"optModule" gorm:"comment:操作模块;type:varchar(100);"`
	OptIp     string `json:"optIp" form:"optIp" gorm:"comment:操作IP;varchar(20);"`
	OptAdmin  string `json:"optAdmin" form:"optAdmin" gorm:"comment:操作人;type:varchar(50);"`
	OptCode   int    `json:"optCode" form:"optCode" gorm:"comment:操作结果;type:int(11);"`
	OptMsg    string `json:"optMsg" form:"optMsg" gorm:"comment:操作信息;type:varchar(255);"`
	OptData   string `json:"optData" form:"optData" gorm:"comment:操作响应;type:text;"`
	OptTime   string `json:"optTime" gorm:"comment:操作时间;type:varchar(30);"`
	OptParam  string `json:"optParam" gorm:"comment:操作参数;type:text;"`
	OptPath   string `json:"optPath" form:"optPath" gorm:"comment:操作路径;type:varchar(255);"`
}

func (SysOptLog) TableName() string {
	return "sys_opt_log"
}
