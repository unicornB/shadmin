package service

import (
	"encoding/json"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"shadmin/conf"
	"shadmin/serializer"
	"strconv"

	ginI18n "github.com/fishjar/gin-i18n"
	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/google/uuid"
)

type SysUploadService struct {
}

func (u *SysUploadService) upload(filePath string, fileName string) (*resty.Response, error) {
	client := resty.New()
	url := fmt.Sprintf("%s/append/%s", os.Getenv("WFS_URL"), fileName)
	return client.R().
		SetFile("file", filePath).
		SetHeader("username", os.Getenv("WFS_USERNAME")).
		SetHeader("password", os.Getenv("WFS_PASSWORD")).
		Post(url)
}

// 上传文件
// curl -F "file=@/Users/apple/Downloads/我的运单 (2).png" "http://47.109.192.28:5122/append/test/1.jpg" -H "username:admin" -H "password:123456"
func (u *SysUploadService) UploadFile(file *multipart.FileHeader, path string, c *gin.Context) serializer.Response {
	fileMaxSize, _ := strconv.ParseInt(os.Getenv("UPLOAD_FILE_SIZE"), 10, 64)
	if file.Size > fileMaxSize {
		return serializer.Error(ginI18n.Msg(c, "upload_file_size_error", fileMaxSize/1024/1024), nil)
	}
	uuidV1, _ := uuid.NewUUID()
	ext := filepath.Ext(file.Filename)
	fileName := fmt.Sprintf("%s/%v%s", path, uuidV1, ext)
	resp, err := u.upload(file.Filename, fileName)
	if err != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	}
	var v interface{}
	json.Unmarshal(resp.Body(), &v)
	return serializer.Success(ginI18n.Msg(c, "upload_success"), v)
}

// 删除文件
func (u *SysUploadService) DeleteFile(fileName string, c *gin.Context) serializer.Response {
	client := resty.New()
	url := fmt.Sprintf("%s/delete/%s", os.Getenv("WFS_URL"), fileName)
	conf.Logger.Info(fileName)
	resp, err := client.R().
		SetHeader("username", os.Getenv("WFS_USERNAME")).
		SetHeader("password", os.Getenv("WFS_PASSWORD")).
		Delete(url)
	if err != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	}
	var v interface{}
	json.Unmarshal(resp.Body(), &v)
	return serializer.Success(ginI18n.Msg(c, "upload_success"), v)
}
