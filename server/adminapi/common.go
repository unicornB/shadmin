package adminapi

import (
	"shadmin/conf"
	"shadmin/model"
	"shadmin/serializer"
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func CurrentAdmin(c *gin.Context) *model.SysAdmin {
	if admin, _ := c.Get("admin"); admin != nil {
		if u, ok := admin.(*model.SysAdmin); ok {
			return u
		}
	}
	return nil
}
func ErrorResponse(err error) serializer.Response {
	if ve, ok := err.(validator.ValidationErrors); ok {
		for _, e := range ve {
			field := conf.T(fmt.Sprintf("Field.%s", e.Field()))
			tag := conf.T(fmt.Sprintf("Tag.Valid.%s", e.Tag()))
			return serializer.ParamErr(
				fmt.Sprintf("%s%s", field, tag),
				err,
			)
		}
	}
	if _, ok := err.(*json.UnmarshalTypeError); ok {
		return serializer.ParamErr("JSON类型不匹配", err)
	}

	return serializer.ParamErr("参数错误", err)
}
