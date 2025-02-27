package model

// 执行数据迁移
func migration() {
	// 自动迁移模式
	//_ = DB.AutoMigrate(&User{})
	_ = DB.AutoMigrate(
		// &SysAdmin{},
		&SysConfig{},
		// &SysMenu{},
		// &SysRole{},
		// &SysRoleMenu{},
		// &SysAdminRole{},
		&SysLoginLog{},
		&SysOptLog{},
		&SysFileCate{},
		&SysFile{},
		&DiyPage{},
		&DiyLinkCate{},
		&DiyLink{},
	)
}
