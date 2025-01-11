import { Button, Col, Flex, Input, message, Popover, Row, Space, Tabs, TabsProps, Modal, Form, Select, Checkbox, Pagination, Image, Tooltip, UploadProps, Upload } from "antd";
import styles from './material.module.scss'
import React, { useEffect, useState } from "react";
import { fileCateAdd, fileCateDelete, fileCateList, fileCateUpdate } from "@/common/service/api/filecate";
import { SysFileCate } from "@/common/typings/sys_file_cate";
import RemixIcon from "@/components/RemixIcon";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;
const { Search } = Input;
const Page: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [cateAddLoading, setCateAddLoading] = useState(false);
    const [cateType, setCateType] = useState("image");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [currCate, setCurrCate] = useState<SysFileCate>({} as SysFileCate);
    const [searchForm] = Form.useForm();
    const [accept, setAccept] = useState("image/*");
    const [fileList, setFileList] = useState<any[]>([
        {
            id: 1,
            name: "sadsadsalasjdjasdshdksadksadsadsa.jpg",
            url: "https://php.likeadmin.cn/uploads/images/20250109/202501091730134585c9368.jpeg",
            showtool: false
        },
        {
            id: 2,
            name: "sadsadsalasjdjasdshdksadksadsadsa.jpg",
            url: "https://php.likeadmin.cn/uploads/images/20250108/20250108175630209702025.jpeg",
            showtool: false
        }
    ]);
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
    useEffect(() => {
        getCateList();
    }, [cateType])
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
        setFileList([...fileList])
    };
    const imageItem = (item: any, index: number) => (
        <div onMouseEnter={() => toggleHover(index)}
            onMouseLeave={() => toggleHover(index)}>
            <Image width={118} src={item.url} />
            <Tooltip placement="top" title={item.name}>
                <div className={styles.imageName} >{item.name}</div>
            </Tooltip>
            {
                item.showtool && <div>查看</div>
            }
        </div>
    )
    const props: UploadProps = {
        accept: accept, // 接受上传的文件类型
        name: 'file',
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    return (
        <div className={styles.pageContainer}>
            <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} />
            <div className={styles.box}>
                <div className={styles.left}>
                    <div className={styles.top}>
                        <div className={styles.cateList}>
                            {
                                cateList.map((item: SysFileCate, index: number) => {
                                    return (<Flex className={`${styles.cateItem} ${index == selectedIndex ? styles.selected : ''}`}
                                        onClick={() => setSelectedIndex(index)}
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

                                <Button>删除</Button>
                                <Button>移动</Button>
                            </Flex>
                            <Flex gap="middle" align="center">
                                <Form form={searchForm} name="file_search" layout="inline">
                                    <Form.Item
                                        name="username"
                                    >
                                        <Select placeholder="请选择文件来源" options={[{ value: '前端上传', label: <span>前端上传</span> }, { value: '后端上传', label: <span>后端上传</span> }]} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Search placeholder="请输入名称" enterButton />
                                    </Form.Item>
                                </Form>
                            </Flex>
                        </Flex>
                    </div>
                    <div className={styles.rightContent}>
                        <div className={styles.checkAll}>
                            <Checkbox >当页全选</Checkbox>
                        </div>
                        <div className={styles.imageList}>
                            <Image.PreviewGroup
                                preview={{
                                    onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                                }}
                            >
                                <Flex wrap gap="middle">

                                    {
                                        fileList.map((item, index) => (
                                            <div key={item.id}>
                                                {imageItem(item, index)}
                                            </div>
                                        ))
                                    }
                                </Flex>

                            </Image.PreviewGroup>
                        </div>
                    </div>
                    <div className={styles.rightBottom}>
                        <Flex justify="space-between" align="center">
                            <div className={styles.checkAll}>
                                <Checkbox >当页全选</Checkbox>
                            </div>
                            <Pagination align="start" defaultCurrent={1} total={50} />
                        </Flex>
                    </div>
                </div>
            </div>

        </div>

    )
}
export default Page