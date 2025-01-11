
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons"
import { Button, message, Modal, Space, Table, TableProps, Tag } from "antd"
import { useEffect, useRef, useState } from "react"
import Edit from "./edit"
import { EditMethods } from "@/common/typings/common"
import { del, menuList, menuTree } from "@/common/service/api/menu"
import { SysMenu } from "@/common/typings/sys_menu"
import RemixIcon from "@/components/RemixIcon"
import { genTreeData } from "@/common/utils/menu"
const { confirm } = Modal;
const Page: React.FC = () => {
    const [pageData, setPageData] = useState({
        open: false,
        dataSource: [] as SysMenu[],

        formData: {} as SysMenu, // 表单数据
    })
    const [title, setTitle] = useState("")
    const childRef = useRef<EditMethods>();
    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        const { data } = await menuList();
        setPageData({
            ...pageData,
            dataSource: genTreeData(data?.data || []),
            open: false,

        });
        let treeData = [{ id: 0, name: "根目录", children: genTreeData(data?.data || []) }]
        childRef.current?.setTreeData(treeData)
    }

    const handleAdd = () => {
        setPageData({
            ...pageData,
            open: true,
            formData: {} as SysMenu,
        })
        childRef.current?.resetForm({} as SysMenu);
        setTitle("新增菜单")
    }
    const hideEdit = () => {
        console.log('hideEdit')
        setPageData({
            ...pageData,
            open: false,
        })
    }
    const handleEdit = (record: SysMenu) => {
        setPageData({
            ...pageData,
            open: true,
            formData: record,
        })
        childRef.current?.resetForm(record);
        setTitle("编辑菜单")
    }
    const onSuccess = () => {
        hideEdit();
        getData();
    }
    const handleDelete = async (record: SysMenu) => {
        const { data, error } = await del(record.id!);
        console.log("删除", data)
        if (!error) {
            message.success(data.msg)
            getData();
        } else {
            message.error(error.msg)
        }
    }
    const showDeleteConfirm = (record: SysMenu) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '你要删除该菜单吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                handleDelete(record);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const getTypeElement = (type: number) => {
        switch (type) {
            case 1:
                return <Tag color="blue">目录</Tag>;
            case 2:
                return <Tag color="green">菜单</Tag>;
            case 3:
                return <Tag color="orange">按钮</Tag>;
            case 4:
                return <Tag color="red">接口</Tag>;
            default:
                return <Tag color="blue">目录</Tag>;
        }
    }
    const columns: TableProps<SysMenu>['columns'] = [
        {
            title: '配置名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            render: (_, record) => (
                record.icon && <RemixIcon type={record.icon!} color="#999" size={20} />
            )
        },
        {
            title: '菜单类型',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => {
                return getTypeElement(record.type!);
            }
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '权限标志',
            dataIndex: 'permission',
            key: 'permission',
        },
        {
            title: '路由路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '组件路径',
            dataIndex: 'component',
            key: 'component',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="text" color="primary" variant="link" onClick={() => handleEdit(record)}>编辑</Button>
                    <Button size="small" type="text" onClick={() => showDeleteConfirm(record)} danger>删除</Button>
                </Space>
            )
        }
    ]
    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Button onClick={handleAdd} style={{ marginLeft: "10px" }} type="primary" icon={<PlusOutlined />} iconPosition={"end"}>
                添加
            </Button>
            <Table
                dataSource={pageData.dataSource} columns={columns}
                rowKey={record => record.id!}
            // size={"small"}
            />
            <Edit title={title} ref={childRef} open={pageData.open} onCancel={hideEdit} onSuccess={onSuccess} formData={pageData.formData} />
        </Space>
    )
}
export default Page