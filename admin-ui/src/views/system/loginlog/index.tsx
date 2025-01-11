
import { DeleteOutlined, ExclamationCircleFilled, } from "@ant-design/icons"
import { Button, Form, message, Modal, Space, Table, TableProps } from "antd"
import { useEffect, useState } from "react"


import { SysAdmin, SysAdminRequest } from "@/common/typings/sys_admin"
import { clear, pageList } from "@/common/service/api/loginlog"
import { SysRole } from "@/common/typings/sys_role"
import PermissionButton from "@/components/PermissionButton"
const { confirm } = Modal


const Page: React.FC = () => {
    const [pageData, setPageData] = useState({
        open: false,
        formData: {} as SysAdmin, // 表单数据
        total: 0,
    })
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useState<SysAdminRequest>({ page: 1, limit: 10, username: "", realName: "" } as SysAdminRequest);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getData()
    }, [searchParams])
    const getData = async () => {
        setLoading(true)
        const { data } = await pageList(searchParams);
        setLoading(false)
        setDataSource(data?.data.list || [])
        setPageData({
            ...pageData,
            total: data?.data.total || 0,
            open: false,
        })
    }
    const showDeleteConfirm = () => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '是否要清空日志?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                console.log('OK');
                handleDelete();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const handleDelete = async () => {
        const { data, error } = await clear();
        if (!error) {
            message.success(data.msg)
            getData()
        }
    }
    const columns: TableProps<SysRole>['columns'] = [
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
            title: '登录地址',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: '浏览器',
            dataIndex: 'browser',
            key: 'browser',
        },
        {
            title: '操作系统',
            dataIndex: 'os',
            key: 'os',
        },
        {
            title: '操作状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => {
                return record.status ? '成功' : '失败'
            }
        },
        {
            title: '操作信息',
            dataIndex: 'msg',
            key: 'msg',
        },
        {
            title: '登录时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        }
    ]
    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>

            <PermissionButton permission="system:loginlog:remove">
                <Button onClick={() => showDeleteConfirm()} style={{ marginLeft: "10px" }} type="primary" danger icon={<DeleteOutlined />} iconPosition={"end"}>
                    清空
                </Button>
            </PermissionButton>
            <Table
                dataSource={dataSource} columns={columns}
                rowKey={record => record.id!}
                loading={loading}
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
        </Space>
    )
}
export default Page