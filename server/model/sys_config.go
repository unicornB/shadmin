package model

type SysConfig struct {
	BaseModel
	ConfigName  string `json:"configName" gorm:"type:varchar(50);comment:参数名称;default:'';not null"`
	ConfigKey   string `json:"configKey" gorm:"type:varchar(50);comment:参数键名;default:'';unique;not null"`
	ConfigValue string `json:"configValue" gorm:"type:mediumtext;comment:参数键值"`
	ConfigType  bool   `json:"configType" gorm:"type:tinyint(1);comment:系统内置（1是 0否）;default:1"`
	Remark      string `json:"remark" gorm:"type:varchar(500);comment:备注"`
}

func (SysConfig) TableName() string {
	return "sys_config"
}
