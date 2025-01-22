package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"shadmin/conf"
	"shadmin/model"
	"shadmin/serializer"
	"shadmin/util"
	"strconv"
	"strings"

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

// 删除文件
func (u *SysUploadService) DeleteFile(fileName string) (*resty.Response, error) {
	client := resty.New()
	url := fmt.Sprintf("%s/delete/%s", os.Getenv("WFS_URL"), fileName)
	return client.R().
		SetHeader("username", os.Getenv("WFS_USERNAME")).
		SetHeader("password", os.Getenv("WFS_PASSWORD")).
		Delete(url)
	// if err != nil {
	// 	return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	// }
	// var v interface{}
	// json.Unmarshal(resp.Body(), &v)
	// return serializer.Success(ginI18n.Msg(c, "upload_success"), v)
}

// 后台上传文件
func (u *SysUploadService) SysUploadBacked(c *gin.Context) serializer.Response {
	file, err := c.FormFile("file")
	if err != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	}
	//path, _ := c.GetPostForm("path")
	fileType, _ := c.GetPostForm("fileType")
	cateId, _ := c.GetPostForm("cateId")
	admin, ok := c.Get("admin")
	if !ok {
		return serializer.Error(ginI18n.Msg(c, "admin_not_found")+"2", nil)
	}
	sysAdmin, ok := admin.(*model.SysAdmin)
	if !ok {
		return serializer.Error(ginI18n.Msg(c, "admin_not_found"), nil)
	}
	ext := filepath.Ext(file.Filename)
	if ext == ".apk" {
		fileMaxSize, _ := strconv.ParseInt(os.Getenv("UPLOAD_APK_SIZE"), 10, 64)
		if file.Size > fileMaxSize {
			return serializer.Error(ginI18n.Msg(c, "upload_file_size_error", fileMaxSize/1024/1024), nil)
		}
	} else {
		fileMaxSize, _ := strconv.ParseInt(os.Getenv("UPLOAD_FILE_SIZE"), 10, 64)
		if file.Size > fileMaxSize {
			return serializer.Error(ginI18n.Msg(c, "upload_file_size_error", fileMaxSize/1024/1024), nil)
		}
	}
	uuidV1, _ := uuid.NewUUID()
	allowExtMatch := strings.Replace(ext, ".", "", -1)
	allowExt := strings.Contains(os.Getenv("UPLOAD_FILE_TYPE"), allowExtMatch)
	if !allowExt {
		return serializer.Error(ginI18n.Msg(c, "upload_file_ext_error"), nil)
	}
	fileName := fmt.Sprintf("%s/%v%s", fileType, uuidV1, ext)
	client := resty.New()
	fileContent, _ := file.Open()
	byteContainer, _ := io.ReadAll(fileContent)
	reader := bytes.NewReader(byteContainer)
	url := fmt.Sprintf("%s/append/%s", os.Getenv("WFS_URL"), fileName)
	resp, err := client.R().
		SetFileReader("file", file.Filename, reader).
		SetHeader("username", os.Getenv("WFS_USERNAME")).
		SetHeader("password", os.Getenv("WFS_PASSWORD")).
		Post(url)
	if err != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	}
	var v interface{}
	json.Unmarshal(resp.Body(), &v)
	jsonMap, _ := util.InterfaceToMap(v)
	size, _ := jsonMap["size"].(float64)
	//获取文件md5
	md5, err := util.FileMD5(file)
	if err != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	}
	//字符串转unit
	newCateId, _ := strconv.ParseUint(cateId, 10, 64)
	//保存到数据库
	sysFile := model.SysFile{
		FileName:   file.Filename,
		FilePath:   fileName,
		FileSize:   size,
		UserId:     sysAdmin.ID,
		UploadType: "backend",
		FileType:   fileType,
		Md5:        md5,
		Forever:    true,
		//CateId:     uint(newCateId),
		Host:    os.Getenv("WFS_HOST"),
		Storage: "wfs",
	}
	if newCateId > 0 {
		sysFile.CateId = uint(newCateId)
	}
	res := model.DB.Create(&sysFile)
	if res.Error != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), res.Error.Error())
	}
	if res.RowsAffected == 0 {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), nil)
	}
	return serializer.Success(ginI18n.Msg(c, "upload_success"), v)
}

func (u *SysUploadService) SysUploadBackedVideo(c *gin.Context) serializer.Response {
	file, err := c.FormFile("file")
	if err != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	}
	cateId, _ := c.GetPostForm("cateId")
	admin, ok := c.Get("admin")
	if !ok {
		return serializer.Error(ginI18n.Msg(c, "admin_not_found"), nil)
	}
	sysAdmin, ok := admin.(*model.SysAdmin)
	if !ok {
		return serializer.Error(ginI18n.Msg(c, "admin_not_found"), nil)
	}
	fileMaxSize, _ := strconv.ParseInt(os.Getenv("UPLOAD_VIDEO_SIZE"), 10, 64)
	if file.Size > fileMaxSize {
		return serializer.Error(ginI18n.Msg(c, "upload_file_size_error", fileMaxSize/1024/1024), nil)
	}
	//临时保存
	ext := filepath.Ext(file.Filename)

	allowExtMatch := strings.Replace(ext, ".", "", -1)
	allowExt := strings.Contains(os.Getenv("UPLOAD_FILE_TYPE"), allowExtMatch)
	if !allowExt {
		return serializer.Error(ginI18n.Msg(c, "upload_file_ext_error"), nil)
	}
	uuidV1, _ := uuid.NewUUID()
	filename := fmt.Sprintf("%v%s", uuidV1, ext)
	//保存路径
	dst := path.Join(os.Getenv("UPLOAD_PATH"), filename)
	c.SaveUploadedFile(file, dst)
	//截图
	cover := fmt.Sprintf("%s%s", dst, ".jpg")
	util.FfmpegVideoCover(dst, cover, 1)
	defer os.Remove(dst)
	defer os.Remove(cover)
	//上传视频
	videoFileName := fmt.Sprintf("%s%v%s", "videos/", uuidV1, ext)
	conf.Logger.Info("videoFileName:" + videoFileName)
	resp, err := u.upload(dst, videoFileName)
	if err != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	}
	//上传封面
	coverFileName := fmt.Sprintf("%s%v%s%s", "videos/", uuidV1, ext, ".jpg")
	resp1, err := u.upload(cover, coverFileName)
	if err != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	}
	var v interface{}
	json.Unmarshal(resp.Body(), &v)
	var coverJson interface{}
	json.Unmarshal(resp1.Body(), &coverJson)
	videoJsonMap, _ := util.InterfaceToMap(v)
	//coverJsonMap, _ := util.InterfaceToMap(coverJson)
	videoSize, _ := videoJsonMap["size"].(float64)
	//coverSize, _ := coverJsonMap["size"].(float64)
	//获取文件md5
	md5, err := util.FileMD5(file)
	if err != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), err.Error())
	}
	//字符串转unit
	newCateId, _ := strconv.ParseUint(cateId, 10, 64)
	//保存到数据库
	sysFile := model.SysFile{
		FileName:   file.Filename,
		FilePath:   videoFileName,
		FileSize:   videoSize,
		UserId:     sysAdmin.ID,
		UploadType: "backend",
		FileType:   "video",
		Md5:        md5,
		Forever:    true,
		//CateId:     uint(newCateId),
		Host:    os.Getenv("WFS_HOST"),
		Storage: "wfs",
	}
	if newCateId > 0 {
		sysFile.CateId = uint(newCateId)
	}
	res := model.DB.Create(&sysFile)
	if res.Error != nil {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), res.Error.Error())
	}
	if res.RowsAffected == 0 {
		return serializer.Error(ginI18n.Msg(c, "upload_fail"), nil)
	}
	return serializer.Success(ginI18n.Msg(c, "upload_success"), v)
}
