package service

import (
	"shadmin/model"
	"shadmin/serializer"
	"shadmin/util"

	"github.com/acmestack/gorm-plus/gplus"
	"github.com/gin-gonic/gin"
)

type SysConfigService struct {
	ID          uint   `json:"id"`
	ConfigName  string `json:"configName" binding:"required,min=0,max=50"`
	ConfigKey   string `json:"configKey" binding:"required,min=0,max=50"`
	ConfigValue string `json:"configValue" binding:"required"`
	ConfigType  bool   `json:"configType"`
	Remark      string `json:"remark"`
}

func (service *SysConfigService) Create(c *gin.Context) serializer.Response {
	// 判断Key是否已存在
	var count int64
	model.DB.Model(&model.SysConfig{}).Where("config_key = ?", service.ConfigKey).Count(&count)
	if count > 0 {
		return serializer.Error("Key已存在", nil)
	}
	config := model.SysConfig{
		ConfigName:  service.ConfigName,
		ConfigKey:   service.ConfigKey,
		ConfigValue: service.ConfigValue,
		ConfigType:  service.ConfigType,
		Remark:      service.Remark,
	}
	if err := model.DB.Create(&config).Error; err != nil {
		return serializer.Error("添加失败", err.Error())
	}
	return serializer.Success("添加成功", nil)
}
func (service *SysConfigService) Update(c *gin.Context) serializer.Response {
	// 判断Key是否已存在
	var count int64
	model.DB.Model(&model.SysConfig{}).Where("config_key = ? and id != ?", service.ConfigKey, service.ID).Count(&count)
	if count > 0 {
		return serializer.Error("Key已存在", nil)
	}
	var config model.SysConfig
	if err := model.DB.Where("id = ?", service.ID).First(&config).Error; err != nil {
		return serializer.Error("该参数不存在", err)
	}
	config.ConfigName = service.ConfigName
	config.ConfigKey = service.ConfigKey
	config.ConfigValue = service.ConfigValue
	config.ConfigType = service.ConfigType
	config.Remark = service.Remark
	if err := model.DB.Save(&config).Error; err != nil {
		return serializer.Error("更新失败", err.Error())
	}
	return serializer.Success("更新成功", nil)
}
func (service *SysConfigService) Delete(c *gin.Context) serializer.Response {
	if err := model.DB.Where("id = ?", c.Param("id")).Delete(&model.SysConfig{}).Error; err != nil {
		return serializer.Error("删除失败", err.Error())
	}
	return serializer.Success("删除成功", nil)
}

type SysConfigListSerivce struct {
	ConfigName string `json:"configName" form:"configName"`
	ConfigKey  string `json:"configKey" form:"configKey"`
}

func (service *SysConfigListSerivce) PageList(c *gin.Context) serializer.Response {
	p := util.NewPagination(c)
	query, u := gplus.NewQuery[model.SysConfig]()
	page := gplus.NewPage[model.SysConfig](p.Page, p.Size)
	if service.ConfigName != "" {
		query.Like(&u.ConfigName, "%"+service.ConfigName+"%")
	}
	if service.ConfigKey != "" {
		query.Like(&u.ConfigKey, "%"+service.ConfigKey+"%")
	}
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

// 配置模块
type SysConfigSettingsService struct {
	ConfigKey   string `json:"configKey" form:"configKey"`
	ConfigValue string `json:"configValue" form:"configValue"`
}

// 根据key获取配置
func (service *SysConfigSettingsService) GetByKey(c *gin.Context) serializer.Response {
	var config model.SysConfig
	if err := model.DB.Where("config_key = ?", c.Param("key")).First(&config).Error; err != nil {
		return serializer.Error("获取失败", err.Error())
	}
	return serializer.Success("成功", config)
}

// 根据key更新配置
func (service *SysConfigSettingsService) UpdateByKey(c *gin.Context) serializer.Response {
	var config model.SysConfig
	if err := model.DB.Where("config_key = ?", service.ConfigKey).First(&config).Error; err != nil {
		return serializer.Error("该配置不存在", err.Error())
	}
	if service.ConfigValue == "" {
		return serializer.Error("请设置配置值", nil)
	}
	config.ConfigValue = service.ConfigValue
	if err := model.DB.Save(&config).Error; err != nil {
		return serializer.Error("更新失败", err.Error())
	}
	return serializer.Success("更新成功", nil)
}
