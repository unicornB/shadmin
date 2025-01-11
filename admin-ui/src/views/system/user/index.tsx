
import { ExclamationCircleFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Modal, Space, Switch, Table, TableProps } from "antd"
import { useEffect, useRef, useState } from "react"
import Edit from "./edit"
import { EditMethods } from "@/common/typings/common"
import { adminDelete, adminList } from "@/common/service/api/admin"
import { SysAdmin, SysAdminRequest } from "@/common/typings/sys_admin"
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
    const [form] = Form.useForm();
    // useEffect(() => {
    //     getData()
    // }, [])
    useEffect(() => {
        getData()
    }, [searchParams])
    const getData = async () => {
        const { data } = await adminList(searchParams);
        setDataSource(data?.data.list || [])
        setPageData({
            ...pageData,
            total: data?.data?.total || 0,
            open: false,
        })
    }

    const handleAdd = () => {
        setPageData({
            ...pageData,
            open: true,
            formData: {} as SysAdmin,
        })
        childRef.current?.resetForm({} as SysAdmin);
        setTitle("新增管理员")
    }
    const hideEdit = () => {
        console.log('hideEdit')
        setPageData({
            ...pageData,
            open: false,
        })
    }
    const handleEdit = (record: SysAdmin) => {
        record.password = "......";
        setPageData({
            ...pageData,
            open: true,
            formData: record,
        })
        childRef.current?.resetForm(record);
        setTitle("编辑管理员")
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

    const handleDelete = async (record: SysAdmin) => {
        const { data, error } = await adminDelete(record.id!);
        if (!error) {
            message.success(data.msg)
            getData();
        } else {
            message.error(error.msg)
        }
    }
    const showDeleteConfirm = (record: SysAdmin) => {
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

    const columns: TableProps<SysAdmin>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '真实姓名',
            dataIndex: 'realName',
            key: 'realName',
        },
        {
            title: '是否超管',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            render: (_, record) => {
                return (<span>{record.isAdmin ? '是' : '否'}</span>)
            }
        },
        {
            title: '所属角色',
            dataIndex: 'role',
            key: 'role',
            render: (_, record) => {
                return (<span>{record.role!.name ? record.role!.name : "超级管理员"}</span>)
            }
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
            title: '登录IP',
            dataIndex: 'loginIp',
            key: 'loginIp',
        },
        {
            title: '登录时间',
            dataIndex: 'loginTime',
            key: 'loginTime',
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
                !record.isAdmin && <Space size="middle">
                    <PermissionButton permission="system:user:edit">
                        <Button size="small" type="text" color="primary" variant="link" onClick={() => handleEdit(record)}>编辑</Button>
                    </PermissionButton>
                    <PermissionButton permission="system:user:remove">
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
                    <Form.Item label="用户名" name="username">
                        <Input allowClear placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item label="真实姓名" name="realName">
                        <Input allowClear placeholder="请输入真实姓名" />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={() => form.submit()} type="primary" icon={<SearchOutlined />}>搜索</Button>
                    </Form.Item>
                </Form>

            </div>
            <PermissionButton permission="system:user:add">
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
            <Edit title={title} ref={childRef} open={pageData.open} onCancel={hideEdit} onSuccess={onSuccess} formData={pageData.formData} />
        </Space>
    )
}
export default Page