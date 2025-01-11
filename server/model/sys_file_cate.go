package model

/**
* @Author: HYL
* @Description:
* @File:  sys_file_cate.go
* @Version: 1.0.0
* @Date: 2025/1/8 10:57
 */
type SysFileCate struct {
	BaseModel
	Name string `json:"name" form:"name" gorm:"type:varchar(100);not null;comment:分类名称"`
	// ParentId uint   `json:"parentId" form:"parentId" gorm:"type:int(20);comment:父级ID;default:0"`
	// Level    uint   `json:"level" form:"level" gorm:"type:smallint(2);comment:层级 1:一级 2:二级 3:三级;default:1"`
	Sort uint   `json:"sort" form:"sort" gorm:"type:int(11);comment:排序;default:0"`
	Type string `json:"type" form:"type" gorm:"type:varchar(50);comment:类型;default:image"`
}

func (SysFileCate) TableName() string {
	return "sys_file_cate"
}
