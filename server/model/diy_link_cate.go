package model

type DiyLinkCate struct {
	BaseModel
	Name string `json:"name" form:"name" gorm:"column:name;type:varchar(255);not null"` // 分类名称
	Sort int    `json:"sort" form:"sort" gorm:"column:sort;type:int(11);not null"`      // 排序
}

func (DiyLinkCate) TableName() string {
	return "diy_link_cate"
}
