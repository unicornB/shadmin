
import { DeleteOutlined, ExclamationCircleFilled, SearchOutlined, } from "@ant-design/icons"
import { Button, Form, Input, message, Modal, Select, Space, Table, TableProps } from "antd"
import { useEffect, useRef, useState } from "react"
import { SysAdmin, SysAdminRequest } from "@/common/typings/sys_admin"
import { clear, pageList } from "@/common/service/api/operlog"
import PermissionButton from "@/components/PermissionButton"
import { SysOperLog, SysOperLogRequest } from "@/common/typings/sys_oper_log"
import Detail from "./detail"
import { EditMethods } from "@/common/typings/common"
const { confirm } = Modal


const Page: React.FC = () => {
    const [pageData, setPageData] = useState({
        open: false,
        formData: {} as SysAdmin, // 表单数据
        total: 0,
    })
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useState<SysOperLogRequest>({ page: 1, limit: 10 } as SysOperLogRequest);
    const [loading, setLoading] = useState(false);
    const childRef = useRef<EditMethods>();
    const [form] = Form.useForm();
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
    const handleDetail = (record: SysOperLog) => {
        setPageData({
            ...pageData,
            formData: record,
            open: true,
        })
        childRef.current?.resetForm(record); // 调用子组件方法
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
    const hideEdit = () => {
        setPageData({
            ...pageData,
            open: false,
        })
    }
    const onFormFinsh = (values: any) => {
        setSearchParams({
            ...searchParams,
            ...values
        })
    }
    const columns: TableProps<SysOperLog>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '请求接口',
            dataIndex: 'optModule',
            key: 'optModule',
        },
        {
            title: '请求方法',
            dataIndex: 'optMethod',
            key: 'optMethod',
        },
        {
            title: '请求路径',
            dataIndex: 'optPath',
            key: 'optPath',
        },
        {
            title: '操作人员',
            dataIndex: 'optAdmin',
            key: 'optAdmin',
        },
        {
            title: '操作状态',
            dataIndex: 'optCode',
            key: 'optCode',
            render: (_, record) => {
                return record.optCode == 200 ? '成功' : '失败'
            }
        },
        {
            title: '操作信息',
            dataIndex: 'optMsg',
            key: 'optMsg',
        },
        {
            title: '操作时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="text" color="primary" variant="link" onClick={() => handleDetail(record)}>查看</Button>

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
                    <Form.Item label="请求接口" name="optModule">
                        <Input allowClear placeholder="请输入请求接口" />
                    </Form.Item>
                    <Form.Item label="请求方法" name="optMethod">
                        <Select style={{ width: 120 }} placeholder="请选择请求方法">
                            <Select.Option value="GET">GET</Select.Option>
                            <Select.Option value="POST">POST</Select.Option>
                            <Select.Option value="PUT">PUT</Select.Option>
                            <Select.Option value="DELETE">DELETE</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="操作人员" name="optAdmin">
                        <Input allowClear placeholder="请输入操作人员" />
                    </Form.Item>
                    <Form.Item label="操作状态" name="optCode">
                        <Select style={{ width: 120 }} placeholder="请选择操作状态">
                            <Select.Option value={200}>成功</Select.Option>
                            <Select.Option value={0}>失败</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={() => form.submit()} type="primary" icon={<SearchOutlined />}>搜索</Button>
                    </Form.Item>
                </Form>

            </div>
            <PermissionButton permission="system:operlog:clear">
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
            <Detail title={"详情"} ref={childRef} onCancel={hideEdit} open={pageData.open} formData={pageData.formData} />
        </Space>
    )
}
export default Page