package middleware

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"shadmin/model"
	"shadmin/serializer"
	"time"

	"github.com/gin-gonic/gin"
)

type ResponseWriterWrapper struct {
	gin.ResponseWriter
	Body *bytes.Buffer // 缓存
}

func (w ResponseWriterWrapper) Write(b []byte) (int, error) {
	w.Body.Write(b)
	return w.ResponseWriter.Write(b)
}

func (w ResponseWriterWrapper) WriteString(s string) (int, error) {
	w.Body.WriteString(s)
	return w.ResponseWriter.WriteString(s)
}
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		if admin, _ := c.Get("admin"); admin != nil {
			if _, ok := admin.(*model.SysAdmin); ok {
				t := time.Now() // 开始时间
				// 请求方式
				method := c.Request.Method
				// 请求ip
				clientIP := c.ClientIP()
				// 路由
				path := c.Request.URL.Path
				reqBody, _ := io.ReadAll(c.Request.Body)
				defer c.Request.Body.Close()                            // 关闭
				c.Request.Body = io.NopCloser(bytes.NewBuffer(reqBody)) // 重置body
				blw := &ResponseWriterWrapper{Body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
				c.Writer = blw
				c.Next()

				var returnJson serializer.Response
				json.Unmarshal(blw.Body.Bytes(), &returnJson)
				// 请求后
				latency := time.Since(t) // 执行时间
				//jsonParams, _ := json.Marshal(c.Params)
				go func() {
					//保存操作日志
					//查询接口名称
					module := "其他"
					var sysMenu model.SysMenu
					rs := model.DB.Where("path = ? and type = 4", path).First(&sysMenu)
					if rs.RowsAffected > 0 {
						module = sysMenu.Name
					}
					if method != "GET" {
						optLog := model.SysOptLog{
							OptAdmin:  admin.(*model.SysAdmin).Username,
							OptMethod: method,
							OptPath:   path,
							OptIp:     clientIP,
							OptCode:   returnJson.Code,
							OptParam:  string(reqBody),
							OptData:   blw.Body.String(),
							OptTime:   latency.String(),
							OptMsg:    returnJson.Msg,
							OptModule: module,
						}
						if err := model.DB.Create(&optLog).Error; err != nil {
							fmt.Printf("optLog err:%v\n", err)
						}
					}

				}()
			}

		}
	}
}
