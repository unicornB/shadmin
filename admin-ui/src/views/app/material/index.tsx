import { Button, Flex, Input, message, Popover, Space, Tabs, TabsProps, Modal, Form, Select, Checkbox, Pagination, Image, Tooltip, UploadProps, Upload, Empty } from "antd";
import styles from './material.module.scss'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { fileCateAdd, fileCateDelete, fileCateList, fileCateUpdate } from "@/common/service/api/filecate";
import { SysFileCate } from "@/common/typings/sys_file_cate";
import RemixIcon from "@/components/RemixIcon";
import { CheckOutlined, ExclamationCircleFilled, PlayCircleOutlined } from "@ant-design/icons";
import { getToken } from "@/common/utils/auth";
import { delFile, moveFile, pageList, reFileName } from "@/common/service/api/file";
import { SysFile, SysFileRequest } from "@/common/typings/sys_file";
import type { CheckboxProps, GetProps, PaginationProps } from 'antd';
import copy from 'copy-to-clipboard';
const { confirm } = Modal;
const { Search } = Input;
type SearchProps = GetProps<typeof Input.Search>;
import musicPng from "@/assets/images/music1.png"
import docPng from "@/assets/images/file/docx.png"
import xlsPng from "@/assets/images/file/xls.png"
import pptPng from "@/assets/images/file/ppt.png"
import pdfPng from "@/assets/images/file/pdf.png"
import apkPng from "@/assets/images/file/apk.png"
import zipPng from "@/assets/images/file/zip.png"
import filePng from "@/assets/images/file/file.png"
import { MaterialPickerMethods, MaterialPickerProps } from "@/components/MaterialPicker";
const Page: React.FC<MaterialPickerProps> = forwardRef<MaterialPickerMethods, MaterialPickerProps>((materialProps, ref) => {
    const [open, setOpen] = useState(false);
    const [cateAddLoading, setCateAddLoading] = useState(false);
    const [cateType, setCateType] = useState("image");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [currCate, setCurrCate] = useState<SysFileCate>({} as SysFileCate);
    const [searchForm] = Form.useForm();
    const [accept, setAccept] = useState("image/*");
    const [fileList, setFileList] = useState<SysFile[]>([]);
    const [checkAll, setCheckAll] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [searchParmas, setSearchParmas] = useState<SysFileRequest>({ page: 1, limit: 14, cateId: -2, uploadType: "", fileName: "", fileType: "image" } as SysFileRequest);
    const [currFile, setCurrFile] = useState<SysFile>({} as SysFile);
    const [total, setTotal] = useState(0);
    const [openMoveDialog, setOpenMoveDialog] = useState(false);
    const [oldCateList, setOldCateList] = useState<SysFileCate[]>([]);
    const [moveCateId, setMoveCateId] = useState(0);
    const [isPicker, setIsPicker] = useState(false);
    const [selectedList, setSelectedList] = useState<SysFile[]>([]);
    const originCateList = [{
        id: -2,
        name: "全部",
        type: "image",
    },
    {
        id: -1,
        name: "未分组",
        type: "image",
    },]
    const [cateList, setCateList] = useState<SysFileCate[]>([]);
    useImperativeHandle(ref, (): any => ({
        getSelectedMaterial: () => {
            return selectedList;
        },
    }));
    useEffect(() => {
        // 这里的代码只会在组件挂载时执行一次
        if (materialProps.fileType) {
            const fileType = materialProps.fileType
            console.log("选择类型", fileType)
            setCateType(fileType!)
            setSearchParmas({ ...searchParmas, fileType: fileType })
            setIsPicker(true)
            if (fileType === 'image') {
                setAccept('image/*')
            } else if (fileType === 'video') {
                setAccept('video/*')
            } else if (fileType === 'file') {
                setAccept('application/*')
            } else if (fileType === 'audio') {
                setAccept('audio/*')
            }
        }
    }, [materialProps.fileType]);

    useEffect(() => {
        getCateList();
    }, [cateType])
    useEffect(() => {
        getFileList();
    }, [searchParmas])
    useEffect(() => {
        fileList.filter((item) => item.checked).length > 0 ? setBtnDisabled(false) : setBtnDisabled(true);
    }, [fileList])
    const hide = () => {
        setOpen(false);
    };
    const [cateName, setCateName] = useState('');
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    // 获取分类列表
    const getCateList = async () => {
        const { data } = await fileCateList({ type: cateType });
        setCateList([...originCateList, ...data!.data]);
        setOldCateList(data!.data);
    }
    const getFileList = async () => {
        //const cateId = cateList[selectedIndex]?.id;
        const { data } = await pageList(searchParmas);
        console.log("data!.data.list", data!.data.list)
        setFileList(data!.data.list);
        setTotal(data!.data.total);
    }
    const hanleCateAdd = async () => {
        if (!cateName) {
            message.error('请输入分类名称')
            return
        }
        const params = {
            name: cateName,
            type: cateType,
        } as SysFileCate
        setCateAddLoading(true)
        const { data, error } = await fileCateAdd(params)
        setCateAddLoading(false)
        if (error) {
            message.error(error.msg)
            return
        }
        setCateName('')
        message.success(data.msg)
        setOpen(false)
        getCateList()
    }
    const hanleCateEdit = async (index: number) => {
        if (!currCate.name) {
            message.error('请输入分类名称')
            return
        }
        setCateAddLoading(true)
        const { data, error } = await fileCateUpdate(currCate)
        setCateAddLoading(false)
        if (error) {
            message.error(error.msg)
            return
        }
        setCateName('')
        message.success(data.msg)
        hideEditPopover(index)
        getCateList()
    }
    const showEditPopover = (index: number) => {
        cateList[index].open = true;
        setCateList([...cateList]);
        setCurrCate(cateList[index])
    }
    const hideEditPopover = (index: number) => {
        cateList[index].open = false;
        setCateList([...cateList]);
    }
    const onEditChange = (name: string) => {
        setCurrCate({ ...currCate, name: name })
    }
    const showDeleteConfirm = (index: number) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '是否要删除分组?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                console.log('OK');
                handleDelete(index);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const handleDelete = async (index: number) => {
        const { id } = cateList[index]
        const { error, data } = await fileCateDelete(id!)
        if (error) {
            message.error(error.msg)
        }
        if (data) {
            message.success(data.msg)
            cateList.splice(index, 1)
            setCateList([...cateList])
        }
    }
    const items: TabsProps['items'] = [
        {
            key: 'image',
            label: '图片',

        },
        {
            key: 'video',
            label: '视频',

        },
        {
            key: 'audio',
            label: '音频',

        },
        {
            key: 'file',
            label: '文件',

        },
    ];
    const content = (
        <Flex gap="middle">
            <Input placeholder="请输入分组名称" value={cateName} onChange={(e) => setCateName(e.target.value)} />
            <Flex gap="middle">
                <Button onClick={hide}>取消</Button>
                <Button type="primary" onClick={() => hanleCateAdd()} loading={cateAddLoading}>确定</Button>
            </Flex>
        </Flex>
    );
    const editContent = (index: number) => (
        <Flex gap="middle">
            <Input placeholder="请输入分组名称" value={currCate?.name} onChange={(e) => onEditChange(e.target.value)} />
            <Flex gap="middle">
                <Button onClick={() => hideEditPopover(index)}>取消</Button>
                <Button type="primary" onClick={() => hanleCateEdit(index)} loading={cateAddLoading}>确定</Button>
            </Flex>
        </Flex>
    );
    const moreContent = (index: number) => (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <div>
                <Button size="small" type="text" onClick={() => showEditPopover(index)}>修改分组</Button>
            </div>
            <div>
                <Button size="small" type="text" onClick={() => showDeleteConfirm(index)} >删除分组</Button>
            </div>
        </Space>
    )
    const onTabChange = (key: string) => {
        setSelectedIndex(0)
        setCateType(key)
        setSearchParmas({ ...searchParmas, fileType: key, cateId: -2 });
        if (key === 'image') {
            setAccept('image/*')
        } else if (key === 'video') {
            setAccept('video/*')
        } else if (key === 'file') {
            setAccept('application/*')
        } else if (key === 'audio') {
            setAccept('audio/*')
        }
    }
    const toggleHover = (index: number) => {
        fileList[index].showtool = !fileList[index].showtool
        if (!fileList[index].showtool) {
            fileList[index].showReName = false
            setFileList([...fileList])
        }
        setFileList([...fileList])
    };
    const selectImage = (index: number) => {
        if (isPicker) {
            // if (!fileList[index].checked) {
            //     if (materialProps.limit == selectedList.length) {
            //         message.error('最多只能选择' + materialProps.limit + '个文件')
            //         return
            //     }
            // }
            // fileList[index].checked = !fileList[index].checked
            // setFileList([...fileList])
            if (materialProps.limit == selectedList.length) {
                message.error('最多只能选择' + materialProps.limit + '个文件')
                return
            }
            onPickerSelect(fileList[index])
        } else {
            fileList[index].checked = !fileList[index].checked
            setFileList([...fileList])
        }


    }
    const onPreview = (index: number) => {
        fileList[index].visible = !fileList[index].visible
        setFileList([...fileList])
    }
    const onVideoPreview = (index: number) => {
        window.open(fileList[index].host + "/" + fileList[index].filePath)
    }
    const onReName = (index: number) => {
        fileList[index].showReName = true
        setFileList([...fileList])
        setCurrFile(fileList[index])
    }
    const copyAddr = (file: SysFile) => {
        copy(file.host + "/" + file.filePath)
        message.success('复制成功')
    }
    const imageItem = (item: SysFile, index: number) => {
        let oimageUrl = item.host + "/" + item.filePath + (item.fileType == "video" ? ".jpg" : "")
        let nimageUrl = oimageUrl + "?imageView2/1/w/118/h/118"
        return (
            <div className={styles.imageBox} onMouseEnter={() => toggleHover(index)}
                onMouseLeave={() => toggleHover(index)}>
                <Image onClick={() => selectImage(index)} width={98} height={98} style={{ borderRadius: 4 }} preview={false} src={nimageUrl} />
                <Image style={{ display: 'none' }} preview={{
                    visible: item.visible,
                    src: oimageUrl,
                    onVisibleChange: (_) => {
                        //setVisible(value);
                        onPreview(index)
                    },
                }} src={item.host + "/" + item.filePath} />
                <Tooltip placement="top" title={item.fileName}>
                    <div className={styles.imageName} >{item.fileName}</div>
                </Tooltip>
                {
                    item.showtool ? <Flex justify="space-between">
                        <Popover content={reNameContent(index, item)} title="" trigger="click" open={item.showReName}>
                            <div></div>
                        </Popover>
                        <div onClick={() => onReName(index)} className={styles.imageToolItem}>重命名</div>
                        <div onClick={() => onPreview(index)} className={styles.imageToolItem}>查看</div>
                        <div className={styles.imageToolItem} onClick={() => copyAddr(item)} > 地址</div>
                    </Flex> : <div style={{ height: 20, marginTop: 10 }}></div>
                }
                {
                    item.checked && <div onClick={() => selectImage(index)} className={styles.itemChecked}><CheckOutlined style={{ color: '#fff', fontSize: 25 }} /></div>
                }
            </div >
        )
    }
    const videoItem = (item: SysFile, index: number) => {
        let oimageUrl = item.host + "/" + item.filePath + (item.fileType == "video" ? ".jpg" : "")
        let nimageUrl = oimageUrl + "?imageView2/1/w/118/h/118"
        return (
            <div className={styles.imageBox} onMouseEnter={() => toggleHover(index)}
                onMouseLeave={() => toggleHover(index)}>
                <div style={{ position: 'relative' }}>
                    <Image onClick={() => selectImage(index)} width={98} height={98} style={{ borderRadius: 4 }} preview={false} src={nimageUrl} />
                    <div className={styles.playBtn}>
                        <PlayCircleOutlined onClick={() => onVideoPreview(index)} className={styles.imageToolItem} style={{ color: '#fff', fontSize: 30 }} />
                    </div>
                </div>
                <Tooltip placement="top" title={item.fileName}>
                    <div className={styles.imageName} >{item.fileName}</div>
                </Tooltip>
                {
                    item.showtool ? <Flex justify="space-between">
                        <Popover content={reNameContent(index, item)} title="" trigger="click" open={item.showReName}>
                            <div></div>
                        </Popover>
                        <div onClick={() => onReName(index)} className={styles.imageToolItem}>重命名</div>
                        <div onClick={() => onVideoPreview(index)} className={styles.imageToolItem}>查看</div>
                        <div className={styles.imageToolItem} onClick={() => copyAddr(item)} > 地址</div>
                    </Flex> : <div style={{ height: 20, marginTop: 10 }}></div>
                }
                {
                    item.checked && <div onClick={() => selectImage(index)} className={styles.itemChecked}><CheckOutlined style={{ color: '#fff', fontSize: 25 }} /></div>
                }
            </div >
        )
    }
    const audioItem = (item: SysFile, index: number) => {
        return (
            <div className={styles.imageBox} onMouseEnter={() => toggleHover(index)}
                onMouseLeave={() => toggleHover(index)}>
                <div style={{ position: 'relative' }}>
                    <Image onClick={() => selectImage(index)} width={98} height={98} style={{ borderRadius: 4 }} preview={false} src={musicPng} />
                    <div className={styles.playBtn}>
                        <PlayCircleOutlined onClick={() => onVideoPreview(index)} className={styles.imageToolItem} style={{ color: '#fff', fontSize: 30 }} />
                    </div>
                </div>
                <Tooltip placement="top" title={item.fileName}>
                    <div className={styles.imageName} >{item.fileName}</div>
                </Tooltip>
                {
                    item.showtool && <Flex justify="space-between" style={{ marginTop: 10 }}>
                        <Popover content={reNameContent(index, item)} title="" trigger="click" open={item.showReName}>
                            <div></div>
                        </Popover>
                        <div onClick={() => onReName(index)} className={styles.imageToolItem}>重命名</div>
                        <div onClick={() => onVideoPreview(index)} className={styles.imageToolItem}>查看</div>
                        <div className={styles.imageToolItem} onClick={() => copyAddr(item)} > 地址</div>
                    </Flex>
                }
                {
                    item.checked && <div onClick={() => selectImage(index)} className={styles.itemChecked}><CheckOutlined style={{ color: '#fff', fontSize: 25 }} /></div>
                }
            </div >
        )
    }
    const getFileImage = (item: SysFile) => {
        const ext = item.filePath.split('.').pop()
        switch (ext) {
            case 'doc':
            case 'docx':
                return docPng
            case 'ppt':
            case 'pptx':
                return pptPng
            case 'xls':
            case 'xlsx':
                return xlsPng
            case 'pdf':
                return pdfPng
            case 'apk':
                return apkPng
            case 'zip':
                return zipPng
            default:
                return filePng
        }
    }
    const fileItem = (item: SysFile, index: number) => {
        return (
            <div className={styles.imageBox} onMouseEnter={() => toggleHover(index)}
                onMouseLeave={() => toggleHover(index)}>
                <div style={{ position: 'relative' }}>
                    <Image onClick={() => selectImage(index)} width={98} height={98} style={{ borderRadius: 4 }} preview={false} src={getFileImage(item)} />
                </div>
                <Tooltip placement="top" title={item.fileName}>
                    <div className={styles.imageName} >{item.fileName}</div>
                </Tooltip>
                {
                    item.showtool ? <Flex justify="space-between" style={{ marginTop: 10 }}>
                        <Popover content={reNameContent(index, item)} title="" trigger="click" open={item.showReName}>
                            <div></div>
                        </Popover>
                        <div onClick={() => onReName(index)} className={styles.imageToolItem}>重命名</div>
                        <div onClick={() => onVideoPreview(index)} className={styles.imageToolItem}>查看</div>
                        <div className={styles.imageToolItem} onClick={() => copyAddr(item)} > 地址</div>
                    </Flex> : <div style={{ height: 30, marginTop: 10 }}></div>
                }
                {
                    item.checked && <div onClick={() => selectImage(index)} className={styles.itemChecked}><CheckOutlined style={{ color: '#fff', fontSize: 25 }} /></div>
                }
            </div >
        )
    }
    const getUploadUrl = () => {
        if (accept === 'video/*') {
            return import.meta.env.VITE_API_URL + "/admin/file/upload/video"
        }
        return import.meta.env.VITE_API_URL + "/admin/file/upload"
    }
    const props: UploadProps = {
        accept: accept, // 接受上传的文件类型
        name: 'file',
        action: getUploadUrl(),
        showUploadList: false,
        headers: {
            authorization: getToken(),
            "X-Requested-With": null as any,
        },
        data: {
            fileType: cateType,
            cateId: cateList[selectedIndex]?.id,
        },
        onChange(info) {
            console.log(info)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                if (info.file.response.code == 200) {
                    message.success(`${info.file.name} 上传成功`);
                    getFileList();
                } else {
                    message.error(info.file.response.msg);
                }
            } else {
                //message.error(`${info.file.name} 上传失败`);
            }
        },
    };
    const onChangeCheckAll: CheckboxProps['onChange'] = (e) => {
        console.log('checked = ', e.target.checked);
        setCheckAll(e.target.checked);
        const newFilelist = fileList.map((item: SysFile) => {
            item.checked = e.target.checked;
            return item;
        })
        setFileList(newFilelist);
    };
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(info?.source, value)
        searchForm.submit()
    };
    const handleSearch = (values: any) => {
        console.log(values);
        setSearchParmas({ ...searchParmas, ...values });
        getFileList();
    }
    const onSelectCate = (index: number, cate: SysFileCate) => {
        setSelectedIndex(index)
        const cateId = cate.id;
        setSearchParmas({ ...searchParmas, cateId, page: 1 });
        setCheckAll(false);
    }
    const reNameContent = (index: number, file: SysFile) => (
        <Flex gap="middle">
            <Input placeholder="请输入文件名称" allowClear defaultValue={file.fileName} onChange={(e) => onReNameChange(e.target.value)} />
            <Flex gap="middle">
                <Button onClick={() => hideReNamePopover(index)}>取消</Button>
                <Button type="primary" onClick={() => hanleReName()} loading={cateAddLoading}>确定</Button>
            </Flex>
        </Flex>
    );
    const hideReNamePopover = (index: number) => {
        fileList[index].showReName = false;
        setFileList([...fileList]);
    }
    const onReNameChange = (value: string) => {
        setCurrFile({ ...currFile, fileName: value });
    }
    const hanleReName = async () => {
        console.log(currFile);
        const { error } = await reFileName(currFile);
        if (error) {
            message.error(error.msg);
        } else {
            getFileList();
        }

    }
    const onChange: PaginationProps['onChange'] = (page) => {
        setSearchParmas({ ...searchParmas, page: page });
    };
    const onMoveFile = () => {
        setOpenMoveDialog(true);
    }
    const onChangeMoveCate = (value: string) => {
        const Id = parseInt(value);
        setMoveCateId(Id);
    }
    const handleMoveFileOk = async () => {
        let fileIds: number[] = [];
        fileList.forEach((item) => {
            if (item.checked) {
                fileIds.push(item.id);
            }
        })
        if (fileIds.length === 0) {
            message.error('请选择文件');
            return;
        }
        if (moveCateId == 0) {
            message.error('请选择分类');
            return;
        }
        const { data, error } = await moveFile({ fileIds: fileIds.join(','), cateId: moveCateId });
        if (!error) {
            message.success(data.msg);
            setOpenMoveDialog(false);
            getFileList();
        }

    }
    const onDeleteFile = () => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '是否要删除文件?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                console.log('OK');
                let fileIds: number[] = [];
                fileList.forEach((item) => {
                    if (item.checked) {
                        fileIds.push(item.id);
                    }
                })
                if (fileIds.length === 0) {
                    message.error('请选择文件');
                    return;
                }
                const { data, error } = await delFile({ fileIds: fileIds.join(',') });
                if (!error) {
                    setTimeout(() => {
                        message.success(data.msg);
                        getFileList();
                    }, 1000);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    //选择器操作
    const onPickerSelect = (file: SysFile) => {
        if (materialProps.limit === 1) {
            setSelectedList([file]);
        }
        //判断是否已经选择
        if (selectedList.find((item) => item.id === file.id)) {
            //删除该文件
            setSelectedList(selectedList.filter((item) => item.id !== file.id));
            return;
        }
        setSelectedList([...selectedList, file]);
    }
    const getSelectItemImgUrl = (file: SysFile) => {
        let oimageUrl = file.host + "/" + file.filePath + (file.fileType == "video" ? ".jpg" : "")
        let imgUrl = oimageUrl + "?imageView2/1/w/118/h/118"
        if (file.fileType == "file") {
            imgUrl = getFileImage(file)
        }
        return imgUrl
    }
    const toggleSelectHover = (index: number) => {
        selectedList[index].showDelete = !selectedList[index].showDelete;
        setSelectedList([...selectedList]);
    }
    const deleteSelectItem = (index: number) => {
        selectedList.splice(index, 1);
        setSelectedList([...selectedList]);
        //去掉选择的文件
    }
    const clearSelectList = () => {
        setSelectedList([]);
    }
    return (
        <div className={styles.pageContainer}>
            {!isPicker && <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} />}
            <div className={styles.box}>
                <div className={styles.left}>
                    <div className={styles.top}>
                        <div className={styles.cateList}>
                            {
                                cateList.map((item: SysFileCate, index: number) => {
                                    return (<Flex className={`${styles.cateItem} ${index == selectedIndex ? styles.selected : ''}`}
                                        onClick={() => onSelectCate(index, item)}
                                        key={'catkey_' + index}
                                        gap="middle" justify="flex-start" align="center">
                                        <Popover content={editContent(index)} title="" trigger="click" open={item.open}>
                                            <div></div>
                                        </Popover>
                                        <Flex justify="center" align="center">
                                            <RemixIcon type="ri-folder-3-fill" color={index == selectedIndex ? '#1890ff' : '#333'} size={20} />
                                            <span className={styles.title}>{item.name}</span>
                                        </Flex>
                                        {
                                            item!.id && item!.id > 0 &&
                                            <Popover content={moreContent(index)} title="" placement="bottom" trigger="hover">
                                                <Button type="text" icon={<RemixIcon type="ri-more-line" color={index == selectedIndex ? '#1890ff' : '#333'} size={20} />} />
                                            </Popover>
                                        }
                                    </Flex>)
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        <Popover content={content} title="" trigger="click" open={open} onOpenChange={handleOpenChange}>
                            <Button color="primary" variant="link">
                                添加分组
                            </Button>
                        </Popover>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.rightTop}>
                        <Flex gap="middle" justify="space-between" align="center">
                            <Flex gap="middle" align="center">
                                <Upload {...props}>
                                    <Button type="primary">上传文件</Button>
                                </Upload>
                                {!isPicker && <Button disabled={btnDisabled} onClick={() => onDeleteFile()}>删除</Button>}
                                {!isPicker && <Button disabled={btnDisabled} onClick={() => onMoveFile()}>移动</Button>}
                            </Flex>
                            <Flex gap="middle" align="center">
                                <Form form={searchForm} name="file_search" layout="inline" onFinish={handleSearch}>
                                    <Form.Item
                                        name="uploadType"
                                    >
                                        <Select allowClear placeholder="请选择文件来源" options={[{ value: 'fontend', label: <span>前端上传</span> }, { value: 'backend', label: <span>后端上传</span> }]} />
                                    </Form.Item>
                                    <Form.Item name="fileName">
                                        <Search allowClear placeholder="请输入名称" onSearch={onSearch} enterButton />
                                    </Form.Item>
                                </Form>
                            </Flex>
                        </Flex>
                    </div>
                    <div className={styles.rightContent}>
                        {!isPicker && <div className={styles.checkAll}>
                            <Checkbox checked={checkAll} onChange={onChangeCheckAll}>当页全选</Checkbox>
                        </div>}
                        <div className={styles.imageList}>
                            <Flex wrap gap="middle">

                                {
                                    fileList.map((item, index) => (
                                        <div key={item.id}>
                                            {item.fileType == "image" && imageItem(item, index)}
                                            {item.fileType == "video" && videoItem(item, index)}
                                            {item.fileType == "audio" && audioItem(item, index)}
                                            {item.fileType == "file" && fileItem(item, index)}
                                        </div>
                                    ))
                                }

                            </Flex>
                            {
                                fileList.length == 0 && <Empty description="暂无文件" />
                            }
                        </div>
                    </div>
                    <div className={styles.rightBottom}>
                        <Flex justify="space-between" align="center">
                            {!isPicker && <div className={styles.checkAll}>
                                <Checkbox checked={checkAll} onChange={onChangeCheckAll}>当页全选</Checkbox>
                            </div>}
                            {isPicker && <div></div>}
                            <Pagination pageSize={searchParmas.limit} align="start" onChange={onChange} defaultCurrent={searchParmas.page} current={searchParmas.page} total={total} />
                        </Flex>
                    </div>
                </div>
                {
                    isPicker &&
                    <div className={styles.selectedFiles}>
                        <div className={styles.header}>
                            <div className={styles.selecteds}>已选择 {selectedList.length + "/" + materialProps.limit}</div>
                            < a className={styles.clear} onClick={clearSelectList}>清空</a>
                        </div>
                        <div className={styles.selectedList}>
                            <div className={styles.selectedBox}>
                                {
                                    selectedList.map((item: SysFile, index: number) => {
                                        return (
                                            <div key={"s_" + item.id} className={styles.selectedItem} onMouseEnter={() => toggleSelectHover(index)}
                                                onMouseLeave={() => toggleSelectHover(index)}>
                                                <Image width={98} height={98} style={{ borderRadius: 4 }} preview={false} src={getSelectItemImgUrl(item)} />
                                                {
                                                    item.showDelete &&
                                                    <div className={styles.selectedItemDelete} onClick={() => deleteSelectItem(index)}>
                                                        <RemixIcon type="ri-close-circle-fill" ></RemixIcon>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </div>
                }
            </div>
            <Modal
                title="移动文件到"
                okText={"确定"}
                cancelText={"取消"}
                open={openMoveDialog}
                onOk={handleMoveFileOk}
                width={400}
                onCancel={() => setOpenMoveDialog(false)}
            >
                <Select
                    placeholder="请选择分类"
                    options={oldCateList}
                    fieldNames={{ label: 'name', value: 'id' }}
                    onChange={onChangeMoveCate}
                    style={{ width: 200 }}
                />
            </Modal>
        </div>

    )
})
export default Page