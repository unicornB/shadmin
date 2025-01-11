package middleware

import (
	"fmt"
	"os"
	"shadmin/model"
	"shadmin/serializer"
	"shadmin/service"
	"shadmin/util"
	"strings"

	"github.com/gin-gonic/gin"
)

// CurrentUser 获取登录用户
func CurrentAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		var uid uint
		token := c.GetHeader("Authorization")
		if token != "" {
			user, err := util.ParseJwt(token, os.Getenv("JWT_SECRET"))
			if err == nil {
				uid = user.ID
			}
		}
		if uid > 0 {
			admin, err := model.GetAdmin(uid)
			if err == nil {
				c.Set("admin_id", &uid)
				c.Set("admin", &admin)
			}
		}
		c.Next()
	}
}

// AuthRequired 需要登录

func AuthRequired() gin.HandlerFunc {
	fmt.Println("拦截验证登录1")
	return func(c *gin.Context) {
		fmt.Println("拦截验证登录")
		isNoRight := false
		if admin, _ := c.Get("admin"); admin != nil {
			if sysAdmin, ok := admin.(*model.SysAdmin); ok {
				//数据权限控制
				var service service.SysRoleMenuService
				perms := service.SysRoleMenuGetMenusPermByRoleId(sysAdmin.RoleId, sysAdmin.IsAdmin)
				path := c.Request.URL.Path
				isContinsin := false
				for _, v := range perms {
					if strings.Contains(path, v) {
						isContinsin = true
					}
				}
				if isContinsin {
					c.Next()
					return
				} else {
					isNoRight = true
				}
			}
		}
		if isNoRight {
			c.JSON(200, serializer.NoRightErr())
			c.Abort()
		} else {
			c.JSON(200, serializer.CheckLogin())
			c.Abort()
		}
	}
}
