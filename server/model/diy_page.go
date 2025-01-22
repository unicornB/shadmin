package model

/**
* DIY页面
 */
type DiyPage struct {
	BaseModel
	Name  string `json:"name" form:"name" gorm:"type:varchar(50);comment:模版明称;not null"`
	Type  string `json:"type" form:"type" gorm:"type:varchar(30);comment:模版类型 home|featured;not null"`
	Data  string `json:"data" form:"data" gorm:"type:longtext;comment:模版数据;"`
	Title string `json:"title" form:"title" gorm:"type:varchar(50);comment:页面标题;"`
}

func (DiyPage) TableName() string {
	return "diy_page"
}
