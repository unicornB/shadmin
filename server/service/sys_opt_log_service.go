package service

import (
	"shadmin/model"
	"shadmin/serializer"
	"shadmin/util"

	"github.com/acmestack/gorm-plus/gplus"
	"github.com/gin-gonic/gin"
)

type SysOptLogService struct {
	model.SysOptLog
}

func (service *SysOptLogService) PageList(c *gin.Context) serializer.Response {
	p := util.NewPagination(c)
	query, u := gplus.NewQuery[model.SysOptLog]()
	page := gplus.NewPage[model.SysOptLog](p.Page, p.Size)
	if service.OptAdmin != "" {
		query.Like(&u.OptAdmin, "%"+service.OptAdmin+"%")
	}
	if service.OptModule != "" {
		query.Like(&u.OptModule, "%"+service.OptModule+"%")
	}
	if service.OptIp != "" {
		query.Like(&u.OptIp, "%"+service.OptIp+"%")
	}
	if service.OptPath != "" {
		query.Like(&u.OptPath, "%"+service.OptPath+"%")
	}
	query.OrderByDesc(&u.CreatedAt)
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
func (service *SysOptLogService) Clear(c *gin.Context) serializer.Response {
	err := model.DB.Where("1=1").Delete(&model.SysOptLog{}).Error
	if err != nil {
		return serializer.ParamErr("清空失败", err)
	}
	return serializer.Success("成功", nil)
}
