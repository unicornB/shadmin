package model

// SysMenu 菜单管理 目前只支持二级菜单，三级按钮
type SysMenu struct {
	BaseModel
	Name       string `json:"name" gorm:"type:varchar(100);comment:权限名称;not null;" binding:"required"`
	Type       int    `json:"type" gorm:"type:smallint(2);comment:菜单类型(1目录 2菜单 3按钮,4接口);not null" binding:"required"`
	Path       string `json:"path" gorm:"type:varchar(100);comment:路由地址;"`
	Component  string `json:"component" gorm:"type:varchar(100);comment:组件路径;"`
	ParentId   uint   `json:"parentId" gorm:"type:bigint(20);size:11;default:0;comment:父级id"`
	Sort       int    `json:"sort" gorm:"type:int(11);comment:排序(数字越小越靠前);default:0"`
	Icon       string `json:"icon" gorm:"type:varchar(100);default:'';comment:图标;"`
	Redirect   string `json:"redirect" gorm:"type:varchar(100);comment:重定向"`
	IsRoute    bool   `json:"isRoute" gorm:"type:tinyint(1);comment:是否是路由 0=不是1=是;default:0"`
	IsMenu     bool   `json:"isMenu" gorm:"type:tinyint(1);comment:是否是菜单 0不是 1是;default:0"`
	IsShow     bool   `json:"isShow" gorm:"type:tinyint(1);default:1;comment:是否显示 0不显示 1显示;"`
	Remark     string `json:"remark" gorm:"type:varchar(255);default:'';comment:备注"`
	Status     bool   `json:"status" gorm:"type:tinyint(1);default:1;comment:状态 0禁用 1启用;"`
	Params     string `json:"params" gorm:"type:varchar(100);default:'';comment:参数"`
	Permission string `json:"permission" gorm:"type:varchar(100);comment:权限标识;"`
}

func (SysMenu) TableName() string {
	return "sys_menu"
}

type MenuExtend struct {
	SysMenu                // 继承model.Menu
	Children []*MenuExtend `gorm:"-" json:"children,omitempty"`
}
type Menu struct {
	ID       int    `json:"id"`
	Pid      int    `json:"pid"`     // 父级id
	Label    string `json:"label"`   // 菜单名称
	Icon     string `json:"icon"`    // 菜单图标
	Path     string `json:"path"`    // 菜单路径
	Key      string `json:"key"`     // 菜单key
	Display  int    `json:"display"` // 是否显示 0不显示 1显示
	Children []Menu `json:"children"`
}

func GetMenuTree(list []SysMenu) []MenuExtend {
	var menuList []MenuExtend
	for _, v := range list {
		if v.ParentId == 0 {
			menuExtend := MenuExtend{SysMenu: v, Children: GetChildren(list, int(v.ID))}
			menuList = append(menuList, menuExtend)
		}

	}
	return menuList
}
func GetChildren(list []SysMenu, pid int) []*MenuExtend {
	var menuList []*MenuExtend
	for _, v := range list {
		if int(v.ParentId) == pid {
			menuExtend := MenuExtend{SysMenu: v, Children: []*MenuExtend{}}
			menuList = append(menuList, &menuExtend)
		}
	}
	return menuList
}
