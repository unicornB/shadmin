
import { ExclamationCircleFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Modal, Space, Switch, Table, TableProps, Tooltip } from "antd"
import { useEffect, useRef, useState } from "react"
import Edit from "./edit"
import { EditMethods } from "@/common/typings/common"
import { SysAdmin } from "@/common/typings/sys_admin"
import PermissionButton from "@/components/PermissionButton"
import { configDel, configList } from "@/common/service/api/config"
import { SysConfig, SysConfigRequest } from "@/common/typings/sys_config"
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
    const [searchParams, setSearchParams] = useState<SysConfigRequest>({ page: 1, limit: 10 } as SysConfigRequest);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getData()
    }, [searchParams])
    const getData = async () => {
        setLoading(true)
        const { data } = await configList(searchParams);
        setLoading(false)
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
            formData: {} as SysConfig,
        })
        childRef.current?.resetForm({} as SysConfig);
        setTitle("新增参数")
    }
    const hideEdit = () => {
        console.log('hideEdit')
        setPageData({
            ...pageData,
            open: false,
        })
    }
    const handleEdit = (record: SysConfig) => {
        setPageData({
            ...pageData,
            open: true,
            formData: record,
        })
        childRef.current?.resetForm(record);
        setTitle("编辑参数")
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

    const handleDelete = async (record: SysConfig) => {
        const { data, error } = await configDel(record.id!);
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
            content: '你要删除该参数吗?',
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

    const columns: TableProps<SysConfig>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '参数名称',
            dataIndex: 'configName',
            key: 'configName',
        },
        {
            title: '参数键值',
            dataIndex: 'configKey',
            key: 'configKey',
        },
        {
            title: '系统内置',
            dataIndex: 'configType',
            key: 'configType',
            render: (_, record) => {
                return (<span>{record.configType ? '是' : '否'}</span>)
            }
        },
        {
            title: '参数值',
            dataIndex: 'configValue',
            key: 'configValue',
            render: (_, record) => {
                return (
                    <Tooltip placement="top" title={record.configValue}>
                        <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.configValue}</div>
                    </Tooltip>
                )
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
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
                <Space size="middle">
                    <PermissionButton permission="system:config:edit">
                        <Button size="small" type="text" color="primary" variant="link" onClick={() => handleEdit(record)}>编辑</Button>
                    </PermissionButton>
                    <PermissionButton permission="system:config:remove">
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
                    <Form.Item label="参数名称" name="configName">
                        <Input allowClear placeholder="请输入参数名称" />
                    </Form.Item>
                    <Form.Item label="参数键值" name="configKey">
                        <Input allowClear placeholder="请输入参数键值" />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={() => form.submit()} type="primary" icon={<SearchOutlined />}>搜索</Button>
                    </Form.Item>
                </Form>

            </div>
            <PermissionButton permission="system:config:add">
                <Button onClick={handleAdd} style={{ marginLeft: "10px" }} type="primary" icon={<PlusOutlined />} iconPosition={"end"}>
                    添加
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
            <Edit title={title} ref={childRef} open={pageData.open} onCancel={hideEdit} onSuccess={onSuccess} formData={pageData.formData} />
        </Space>
    )
}
export default Page