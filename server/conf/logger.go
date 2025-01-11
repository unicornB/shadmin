package conf

import (
	"os"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

var Logger *zap.Logger

func InitLogger() {
	lumberjackLogger := &lumberjack.Logger{
		Filename:   os.Getenv("LOG_FILE"),
		MaxSize:    10, //MB
		MaxBackups: 3,
		MaxAge:     30,   // days
		Compress:   true, // 是否压缩文件
	}
	// 初始化logger
	Logger = zap.New(zapcore.NewCore(
		//zapcore.NewConsoleEncoder(zap.NewProductionEncoderConfig()), //使用控制台编码器
		getEncoder(),
		zapcore.AddSync(lumberjackLogger), // 将日志写入到 lumberjackLogger 提供的输出中
		zap.InfoLevel,                     // 设置日志级别为 InfoLevel，即只记录 Info 级别及以上的日志消息
	))
	defer Logger.Sync()
}

func getEncoder() zapcore.Encoder {
	encoderConfig := zap.NewProductionEncoderConfig()
	//encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.EncodeTime = func(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
		enc.AppendString(t.Format("2006-01-02 15:04:05"))
	}
	encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
	return zapcore.NewConsoleEncoder(encoderConfig)
}
