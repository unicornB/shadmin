package service

import (
	"shadmin/conf"
	"shadmin/model"
	"shadmin/serializer"
	"shadmin/util"
	"strings"

	"github.com/acmestack/gorm-plus/gplus"
	"github.com/gin-gonic/gin"
)

type SysFileService struct {
	ID         uint   `form:"id" json:"id"`
	FileName   string `form:"fileName" json:"fileName"`
	FileType   string `form:"fileType" json:"fileType"`
	UploadType string `form:"uploadType" json:"uploadType"`
	CateId     int    `form:"cateId" json:"cateId"`
	FileIds    string `form:"fileIds" json:"fileIds"`
}

func (service *SysFileService) PageList(c *gin.Context) serializer.Response {
	p := util.NewPagination(c)
	query, u := gplus.NewQuery[model.SysFile]()
	page := gplus.NewPage[model.SysFile](p.Page, p.Size)
	if service.FileName != "" {
		query.Like(&u.FileName, "%"+service.FileName+"%")
	}
	if service.UploadType != "" {
		query.Like(&u.UploadType, "%"+service.UploadType+"%")
	}
	if service.CateId > 0 {
		query.Eq(&u.CateId, service.CateId)
	}
	if service.CateId == -1 {
		query.Eq(&u.CateId, 0)
	}
	if service.FileType != "" {
		query.Eq(&u.FileType, service.FileType)
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

func (service *SysFileService) ReFileName(c *gin.Context) serializer.Response {
	var sysFile model.SysFile
	res := model.DB.Where("id = ?", service.ID).First(&sysFile)
	if res.Error != nil {
		return serializer.Error("文件不存在", nil)
	}
	sysFile.FileName = service.FileName
	model.DB.Save(&sysFile)
	return serializer.Success("修改成功", nil)
}

// 把文件移动到指定分类
func (service *SysFileService) Move(c *gin.Context) serializer.Response {
	res := model.DB.Model(model.SysFile{}).Where("id in (?)", strings.Split(service.FileIds, ",")).Updates(model.SysFile{CateId: uint(service.CateId)})
	if res.Error != nil {
		return serializer.Error("移动失败", nil)
	}
	return serializer.Success("移动成功", nil)
}

// 批量删除文件
func (service *SysFileService) Delete(c *gin.Context) serializer.Response {
	var files []model.SysFile
	model.DB.Where("id in (?)", strings.Split(service.FileIds, ",")).Find(&files)
	var uploadSerive SysUploadService
	conf.Logger.Sugar().Infof("开始删除文件数：%v", len(files))
	for _, file := range files {
		go func(nFile model.SysFile) {
			uploadSerive.DeleteFile(nFile.FilePath)
			//删除数据库记录
			model.DB.Delete(&nFile)
		}(file)
	}
	return serializer.Success("删除成功", nil)
}
