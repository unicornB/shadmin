package middleware

import (
	"fmt"
	"os"
	"regexp"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Cors 跨域配置
func Cors() gin.HandlerFunc {

	config := cors.DefaultConfig()
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Language", "Authorization"}
	if gin.Mode() == gin.ReleaseMode {
		fmt.Println("生产环境跨域配置" + os.Getenv("CORS_ALLOW"))
		// 生产环境需要配置跨域域名，否则403
		config.AllowOrigins = []string{os.Getenv("CORS_ALLOW")}
	} else {
		// 测试环境下模糊匹配本地开头的请求
		config.AllowOriginFunc = func(origin string) bool {
			if regexp.MustCompile(`^http://127\.0\.0\.1:\d+$`).MatchString(origin) {
				return true
			}
			if regexp.MustCompile(`^http://localhost:\d+$`).MatchString(origin) {
				return true
			}
			return false
		}

	}
	fmt.Println("设置跨域")
	config.AllowCredentials = true

	return cors.New(config)
}
