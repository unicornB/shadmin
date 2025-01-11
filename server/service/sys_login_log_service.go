package service

import (
	"shadmin/model"
	"shadmin/serializer"
	"shadmin/util"

	"github.com/acmestack/gorm-plus/gplus"
	"github.com/gin-gonic/gin"
)

type SysLoginLogService struct {
}

//添加登录日志

func (s *SysLoginLogService) SysLoginLogCreate(status bool, ip, msg, username, os, browser string) error {
	sysLoginLog := &model.SysLoginLog{
		Username: username,
		Ip:       ip,
		Status:   status,
		Msg:      msg,
		Os:       os,
		Browser:  browser,
	}
	return model.DB.Create(sysLoginLog).Error
}
func (service *SysLoginLogService) PageList(c *gin.Context) serializer.Response {
	p := util.NewPagination(c)
	query, u := gplus.NewQuery[model.SysLoginLog]()
	page := gplus.NewPage[model.SysLoginLog](p.Page, p.Size)

	query.OrderByAsc(&u.CreatedAt)
	page, _ = gplus.SelectPage(page, query)
	data := map[string]interface{}{
		"page":  p.Page,
		"limit": p.Size,
		"total": page.Total,
		"list":  page.Records,
	}
	return serializer.Success("成功", data)
}

// 清空日志
func (service *SysLoginLogService) Clear(c *gin.Context) serializer.Response {
	err := model.DB.Where("1=1").Delete(&model.SysLoginLog{}).Error
	if err != nil {
		return serializer.ParamErr("清空失败", err)
	}
	return serializer.Success("成功", nil)
}
