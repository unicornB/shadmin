
import { ExclamationCircleFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Modal, Space, Switch, Table, TableProps } from "antd"
import { useEffect, useRef, useState } from "react"
import Edit from "./edit"
import { EditMethods } from "@/common/typings/common"
import { SysAdmin, SysAdminRequest } from "@/common/typings/sys_admin"
import { del, pageList } from "@/common/service/api/role"
import { SysRole } from "@/common/typings/sys_role"
import { menuList } from "@/common/service/api/menu"
import { genTreeData } from "@/common/utils/menu"
import { SysMenu } from "@/common/typings/sys_menu"
import PermissionButton from "@/components/PermissionButton"
const { confirm } = Modal;
const Page: React.FC = () => {
    const [pageData, setPageData] = useState({
        open: false,
        formData: {} as SysAdmin, // 表单数据
        total: 0,
    })
    const [title, setTitle] = useState("")
    const childRef = useRef<EditMethods>();
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useState<SysAdminRequest>({ page: 1, limit: 10, username: "", realName: "" } as SysAdminRequest);
    const [treeData, setTreeData] = useState<SysMenu[]>([]);
    const [form] = Form.useForm();
    useEffect(() => {
        getData()
    }, [searchParams])
    useEffect(() => {
        initMenu()
    }, [])
    const initMenu = async () => {
        const { data } = await menuList();
        const treeData = genTreeData(data?.data || [])
        setTreeData(treeData)
    }
    const getData = async () => {
        const { data } = await pageList(searchParams);
        setDataSource(data?.data.list || [])
        setPageData({
            ...pageData,
            total: data?.data.total || 0,
            open: false,
        })
    }

    const handleAdd = () => {
        setPageData({
            ...pageData,
            open: true,
            formData: {} as SysRole,
        })
        childRef.current?.resetForm({} as SysRole);
        setTitle("新增角色")
    }
    const hideEdit = () => {
        console.log('hideEdit')
        setPageData({
            ...pageData,
            open: false,
        })
    }
    const handleEdit = (record: SysRole) => {
        setPageData({
            ...pageData,
            open: true,
            formData: record,
        })
        childRef.current?.resetForm(record);
        setTitle("编辑角色")
    }
    const onSuccess = () => {
        hideEdit();
        getData();
    }
    const onFormFinsh = (values: any) => {
        setSearchParams({
            ...searchParams,
            ...values
        })
    }

    const handleDelete = async (record: SysRole) => {
        const { error } = await del(record.id!);
        if (!error) {
            message.success("删除成功")
            getData();
        }
    }
    const showDeleteConfirm = (record: SysRole) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '你要删除该角色吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                console.log('OK');
                handleDelete(record);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const columns: TableProps<SysRole>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '权限字符',
            dataIndex: 'permission',
            key: 'permission',
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => {
                return (<Switch checked={record.status} />)
            }
        },

        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                record.permission != "admin" && <Space size="middle">
                    <PermissionButton permission="system:role:edit">
                        <Button size="small" type="text" color="primary" variant="link" onClick={() => handleEdit(record)}>编辑</Button>
                    </PermissionButton>
                    <PermissionButton permission="system:role:remove">
                        <Button size="small" type="text" onClick={() => showDeleteConfirm(record)} danger>删除</Button>
                    </PermissionButton>

                </Space>
            )
        }
    ]
    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <div className="search">
                <Form
                    layout="inline"
                    name="adminsearchForm"
                    form={form}
                    onFinish={onFormFinsh}
                >
                    <Form.Item label="角色名称" name="name">
                        <Input allowClear placeholder="请输入角色名称" />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={() => form.submit()} type="primary" icon={<SearchOutlined />}>搜索</Button>
                    </Form.Item>
                </Form>

            </div>
            <PermissionButton permission="system:role:add">
                <Button onClick={handleAdd} style={{ marginLeft: "10px" }} type="primary" icon={<PlusOutlined />} iconPosition={"end"}>
                    添加
                </Button>
            </PermissionButton>

            <Table
                dataSource={dataSource} columns={columns}
                rowKey={record => record.id!}
                pagination={{
                    total: pageData.total,
                    pageSize: searchParams.limit,
                    current: searchParams.page,
                    showTotal: total => `共${total}条`,
                    onChange: (page, pageSize) => {
                        setSearchParams({ ...searchParams, page, limit: pageSize })
                    }
                }}
            />
            <Edit title={title} ref={childRef} treeData={treeData} open={pageData.open} onCancel={hideEdit} onSuccess={onSuccess} formData={pageData.formData} />
        </Space>
    )
}
export default Page