package util

import (
	"bytes"
	"fmt"
	"os"

	"github.com/disintegration/imaging"
	ffmpeg "github.com/u2takey/ffmpeg-go"
)

// 截取视频封面
func FfmpegVideoCover(inputPath string, outPath string, frameNum int) error {
	// ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 output.jpg
	buf := bytes.NewBuffer(nil)
	err := ffmpeg.Input(inputPath).
		Filter("select", ffmpeg.Args{fmt.Sprintf("gte(n,%d)", frameNum)}).
		Output("pipe:", ffmpeg.KwArgs{"vframes": 1, "format": "image2", "vcodec": "mjpeg"}).
		Silent(true).
		WithOutput(buf, os.Stdout).
		Run()
	if err != nil {
		return err
	}
	img, err := imaging.Decode(buf)
	if err != nil {
		return err
	}
	err = imaging.Save(img, outPath)
	if err != nil {
		return err
	}
	return nil
}
