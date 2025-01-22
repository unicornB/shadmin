package model

/**
* @Author: HYL
* @Description:
* @File:  sys_file
* @Version: 1.0.0
* @Date: 2020/4/8 10:57
 */
type SysFile struct {
	BaseModel
	FileName   string  `json:"fileName" gorm:"type:varchar(500);not null;comment:文件名"`
	FilePath   string  `json:"filePath" gorm:"comment:文件路径;unique;not null"`
	FileSize   float64 `json:"fileSize" gorm:"comment:文件大小;type:decimal(10,2);default:0"`
	FileType   string  `json:"fileType" gorm:"comment:文件类型 image|video|audio|file"`
	Md5        string  `json:"md5" gorm:"comment:文件md5;unique;not null"`
	Forever    bool    `json:"forever" gorm:"comment:是否永久保存;default:0;type:tinyint(1)"`
	CateId     uint    `json:"cateId" gorm:"comment:分类id;not null;type:bigint(20)"`
	UploadType string  `json:"uploadType" gorm:"comment:上传类型 backend|frontend;not null;type:varchar(50)"`
	UserId     uint    `json:"userId" gorm:"comment:上传用户id;not null;type:bigint(20);default:0"`
	Host       string  `json:"host" gorm:"comment:文件host;not null;type:varchar(100)"`
	Storage    string  `json:"storage" gorm:"comment:文件存储类型 local|qiniu|wfs|oss|obs;not null;type:varchar(50)"`
}

func (SysFile) TableName() string {
	return "sys_file"
}
