package model

/**
*链接管理
 */
type DiyLink struct {
	BaseModel
	LinkName string `json:"link_name" gorm:"comment:链接名称"`
	LinkUrl  string `json:"link_url" gorm:"comment:链接地址"`
}

func (d *DiyLink) TableName() string {
	return "diy_link"
}
