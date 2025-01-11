package service

import (
	"fmt"
	"os"
	"shadmin/conf"
	"shadmin/model"
	"shadmin/serializer"
	"shadmin/util"
	"sort"
	"time"

	"github.com/acmestack/gorm-plus/gplus"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type SysAdminLoginService struct {
	UserName string `form:"username" json:"username" binding:"required,min=4,max=30"`
	Password string `form:"password" json:"password" binding:"required,min=6,max=40"`
	Os       string `form:"os" json:"os"`
	Browser  string `form:"browser" json:"browser"`
}

func (service *SysAdminLoginService) SysAdminLogin(c *gin.Context) serializer.Response {
	var admin model.SysAdmin

	if err := model.DB.Where("username = ?", service.UserName).First(&admin).Error; err != nil {
		//异步添加日志
		go func() {
			var sysLoginLogService SysLoginLogService
			sysLoginLogService.SysLoginLogCreate(false, c.ClientIP(), "账号或密码错误", service.UserName, service.Os, service.Browser)

		}()
		return serializer.ParamErr("账号或密码错误", nil)
	}
	if !admin.CheckPassword(service.Password) {
		//异步添加日志
		go func() {
			var sysLoginLogService SysLoginLogService
			sysLoginLogService.SysLoginLogCreate(false, c.ClientIP(), "账号或密码错误", service.UserName, service.Os, service.Browser)
		}()
		return serializer.ParamErr("账号或密码错误", nil)
	}
	if !admin.Status {
		//异步添加日志
		go func() {
			var sysLoginLogService SysLoginLogService
			sysLoginLogService.SysLoginLogCreate(false, c.ClientIP(), "账号已被禁用", service.UserName, service.Os, service.Browser)
		}()
		return serializer.Error("账号已被禁用", nil)
	}
	// 登录成功，生成token
	token, err := util.GenerateJWT(admin.Username, os.Getenv("JWT_SECRET"), admin.ID)
	if err != nil {
		//异步添加日志
		go func() {
			var sysLoginLogService SysLoginLogService
			sysLoginLogService.SysLoginLogCreate(false, c.ClientIP(), "账号或密码错误", service.UserName, service.Os, service.Browser)

		}()
		return serializer.ParamErr("账号或密码错误", err)
	}
	//更新ip
	admin.LognIp = c.ClientIP()
	admin.LoginTime = model.XTime{Time: time.Now()}
	model.DB.Save(&admin)
	//异步添加日志
	go func() {
		var sysLoginLogService SysLoginLogService
		sysLoginLogService.SysLoginLogCreate(true, c.ClientIP(), "登录成功", admin.Username, service.Os, service.Browser)
		conf.Logger.Sugar().Infoln("登录成功")
	}()
	if admin.IsAdmin {
		// 获取菜单
		var menuService SysMenuService
		data := map[string]interface{}{"token": token, "menu": menuService.SysMenuAll(c), "username": admin.Username}
		return serializer.Success("登录成功", data)
	} else {
		menus := getMenusByRole(admin.RoleId)
		data := map[string]interface{}{"token": token, "menu": menus, "username": admin.Username}
		return serializer.Success("登录成功", data)
	}

}

type SysAdminService struct {
	ID       uint   `json:"id" form:"id"`
	Status   bool   `json:"status"`
	Username string `json:"username" binding:"required,min=4,max=100"`
	RealName string `json:"realName" binding:"required,min=2,max=10"`
	Password string `json:"password" binding:"required,min=6,max=50"`
	RoleId   uint   `json:"roleId" binding:"required"`
}

// SysAdminCreate 创建管理员
func (service *SysAdminService) SysAdminCreate(c *gin.Context) serializer.Response {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(service.Password), 12)
	admin := model.SysAdmin{
		Username: service.Username,
		RealName: service.RealName,
		Password: string(bytes),
		RoleId:   service.RoleId,
	}
	model.DB.Create(&admin)
	return serializer.Success("创建成功", nil)
}

// 更新管理员
func (service *SysAdminService) SysAdminUpdate(c *gin.Context) serializer.Response {
	admin := model.SysAdmin{}
	model.DB.First(&admin, service.ID)
	admin.RealName = service.RealName
	admin.Status = service.Status
	admin.UpdatedAt = model.XTime{Time: time.Now()}
	admin.RoleId = service.RoleId
	model.DB.Save(&admin)
	return serializer.Success("更新成功", nil)
}

// 删除管理员
func (service *SysAdminService) SysAdminDelete(c *gin.Context) serializer.Response {
	model.DB.Delete(&model.SysAdmin{}, c.Param("id"))
	return serializer.Success("删除成功", nil)
}

// 管理员列表
type SysAdminListService struct {
	ID       uint   `json:"id"`
	Username string `json:"username" form:"username"`
	RealName string `json:"realName" form:"realName"`
}

func (service *SysAdminListService) SysAdminList(c *gin.Context) serializer.Response {
	p := util.NewPagination(c)
	query, u := gplus.NewQuery[model.SysAdmin]()
	page := gplus.NewPage[model.SysAdmin](p.Page, p.Size)
	fmt.Println("Username: " + service.Username)
	if service.Username != "" {

		query.Like(&u.Username, "%"+service.Username+"%")
	}
	if service.RealName != "" {
		query.Like(&u.RealName, "%"+service.RealName+"%")
	}
	query.OrderByDesc(&u.CreatedAt)

	page, _ = gplus.SelectPage(page, query)
	//查询角色
	for _, v := range page.Records {
		role := model.SysRole{}
		res := model.DB.First(&role, v.RoleId)
		if res.Error == nil {
			v.Role = role
		}
	}
	data := map[string]interface{}{
		"page":  p.Page,
		"limit": p.Size,
		"total": page.Total,
		"list":  page.Records,
	}
	return serializer.Success("获取应用列表成功", data)
}

// 获取管理员菜单权限
func getMenusByRole(roleId uint) []model.SysMenu {
	var roleMenus []model.SysRoleMenu
	model.DB.Where("role_id = ?", roleId).Find(&roleMenus)
	var menuIds []uint
	for _, v := range roleMenus {
		menuIds = append(menuIds, v.MenuId)
	}
	var menus []model.SysMenu
	model.DB.Where("id in (?)", menuIds).Find(&menus)
	//获取上级菜单
	var parentMenuIds []uint
	for _, v := range menus {
		if v.ParentId != 0 {
			parentMenuIds = append(parentMenuIds, v.ParentId)
		}
	}
	//去重
	parentMenuIds = removeDuplicates(parentMenuIds)
	var parentMenus []model.SysMenu
	model.DB.Where("id in (?)", parentMenuIds).Find(&parentMenus)
	menus = append(menus, parentMenus...)
	//去重
	encountered := map[uint]bool{}
	uniqueMenus := []model.SysMenu{}
	for _, obj := range menus {
		if !encountered[obj.ID] {
			// 未出现过，添加到uniqueObjects并记录
			uniqueMenus = append(uniqueMenus, obj)
			encountered[obj.ID] = true
		}
	}
	sort.SliceStable(uniqueMenus, func(i, j int) bool {
		return uniqueMenus[i].Sort < uniqueMenus[j].Sort
	})
	return uniqueMenus
}
func removeDuplicates(nums []uint) []uint {
	m := make(map[uint]bool)
	for _, num := range nums {
		m[num] = true
	}

	uniqueNums := make([]uint, 0, len(m))
	for num := range m {
		uniqueNums = append(uniqueNums, num)
	}
	return uniqueNums
}
