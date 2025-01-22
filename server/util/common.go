package util

import (
	"crypto/md5"
	"encoding/hex"
	"io"
	"math/rand"
	"mime/multipart"
	"reflect"
	"time"
)

// RandStringRunes 返回随机字符串
func RandStringRunes(n int) string {
	var letterRunes = []rune("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	rand.Seed(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

// interface转map
func InterfaceToMap(in interface{}) (map[interface{}]interface{}, bool) {
	val := reflect.ValueOf(in)
	if val.Kind() != reflect.Map {
		return nil, false
	}

	out := make(map[interface{}]interface{})
	for _, key := range val.MapKeys() {
		out[key.Interface()] = val.MapIndex(key).Interface()
	}
	return out, true
}

// 字符串数组是否包含某字符串
func ArrayContainStr(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
func FileMD5(file *multipart.FileHeader) (string, error) {
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()
	// 计算MD5
	hash := md5.New()
	if _, err := io.Copy(hash, src); err != nil && err != io.EOF {
		return "", err
	}
	md5Value := hex.EncodeToString(hash.Sum(nil))
	return md5Value, nil
}
