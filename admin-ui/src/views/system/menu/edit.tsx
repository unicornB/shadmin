
import { menuAdd, menuUpdate } from "@/common/service/api/menu";
import { EditComponentProps, EditMethods } from "@/common/typings/common";
import { SysMenu } from "@/common/typings/sys_menu";
import RemixIcon from "@/components/RemixIcon";

import { Flex, Form, Input, InputNumber, message, Modal, Popover, Radio, RadioChangeEvent, TreeSelect, } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import IconData from "@/assets/icons/icons.json";
const { Search } = Input;
const Page: FC<EditComponentProps> = forwardRef<EditMethods, EditComponentProps>((props, ref) => {
    const [form] = useForm();
    const [isEdit, setIsEdit] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [treeData, setTreeData] = useState([] as any[])
    const [type, setType] = useState(1);
    const [open, setOpen] = useState(false);
    const [iconData, setIconData] = useState(IconData as string[])
    const text = <span>选择图标</span>;
    const content = (
        <div style={{ width: 300, height: 500, overflowY: 'scroll' }} >
            <Search placeholder="input search text" autoFocus onSearch={(e) => onSearch(e)} style={{ width: 200 }} />
            <Flex wrap gap="small">
                {
                    iconData.map(item => <RemixIcon key={item} type={item} color="#666666" size={20} onClick={
                        () => {
                            console.log(item)
                            //form.setFieldValue("icon", item)
                            form.setFieldsValue({ icon: item });
                            setOpen(false);
                        }
                    } />)
                }
            </Flex>
        </div>
    );
    const IconInput = (props: any) => (
        <Popover open={open} placement="bottom" title={text} content={content} trigger="click">
            <Input {...props} placeholder="请选择图标" onClick={onSelectIcon} readOnly prefix={form.getFieldValue("icon") && <RemixIcon type={form.getFieldValue("icon")} size={20} color="#666666" />} />
        </Popover>
    );
    const onSelectIcon = () => {
        setOpen(!open);
    }
    const onSearch = (e: string) => {
        const data = IconData.filter(item => {
            return item.toLowerCase().includes(e.toLowerCase());
        });
        setTimeout(() => {
            setIconData(data);
        }, 300);
    }
    useImperativeHandle(ref, (): any => ({
        resetForm: (formData: any) => {
            form.setFieldsValue(formData);
            if (Object.keys(formData).length === 0) {
                form.resetFields();
                setIsEdit(false);
                setType(formData.type || 1);
            } else {
                setIsEdit(true);
                setType(formData.type || 1);
            }

        },
        setTreeData: (treeData: any[]) => {
            setTreeData(treeData)
        }
    }));
    useEffect(() => {

        if (props.formData) {
            form.setFieldsValue(props.formData);
        } else {
            form.resetFields();
        }
    }, [])
    const onChangeType = (e: RadioChangeEvent) => {
        setType(e.target.value);
    }
    const onCancel = () => {
        props.onCancel!();
    }
    const handleOk = async () => {
        form.submit();
    }
    const onFinish = async (values: any) => {
        setConfirmLoading(true);
        if (isEdit) {
            const request: SysMenu = values as SysMenu;
            const { data, error } = await menuUpdate(request)
            if (!error) {
                message.success(data.msg)
                props.onSuccess!()
            } else {
                message.error(error.msg)
            }
        } else {
            const request: SysMenu = values as SysMenu;
            const { data, error } = await menuAdd(request)
            if (!error) {
                message.success(data.msg)
                props.onSuccess!()
            } else {
                message.error(error.msg)
            }
        }
        setConfirmLoading(false);
    }

    return (
        <Modal
            title={props.title}
            open={props.open}
            width={800}
            onCancel={onCancel}
            onOk={handleOk}
            okText={"确定"}
            cancelText={"取消"}
            forceRender={true}
            confirmLoading={confirmLoading}
            destroyOnClose={true}
        >
            <Form
                form={form}
                name="menuForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                autoComplete="off"
                onFinish={onFinish}
                initialValues={{ type: 1, isShow: true, status: true }}
            >
                {
                    isEdit &&
                    <Form.Item name="id">
                        <Input type="hidden" />
                    </Form.Item>
                }
                <Form.Item
                    label="上级菜单"
                    name="parentId"
                    rules={[{ required: true, message: '请选择上级菜单' }]}
                >
                    <TreeSelect
                        treeDataSimpleMode
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择上级菜单"
                        fieldNames={{ label: 'name', value: 'id', children: 'children' }}

                        treeData={treeData}
                    />
                </Form.Item>
                <Form.Item
                    label="菜单类型"
                    name="type"
                    rules={[{ required: true, message: '请选择菜单类型' }]}
                >
                    <Radio.Group name="type" onChange={onChangeType}>
                        <Radio value={1}>目录</Radio>
                        <Radio value={2}>菜单</Radio>
                        <Radio value={3}>按钮</Radio>
                        <Radio value={4}>接口</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="菜单图标"
                    name="icon"
                >
                    {/* {(formItemProps) => (
                        <Popover placement="bottom" title={text} content={content} trigger="click">
                            <Input {...formItemProps} placeholder="请选择图标" readOnly />
                        </Popover>
                    )} */}
                    <IconInput />
                </Form.Item>
                <Form.Item
                    label="菜单名称"
                    name="name"
                    rules={[{ required: true, message: '请输入菜单名称' }]}
                >
                    <Input placeholder="请输入菜单名称" />
                </Form.Item>
                <Form.Item
                    label="排序"
                    name="sort"
                    rules={[{ required: true, message: '请输入排序' }]}
                >
                    <InputNumber min={0} placeholder="请输入排序" />
                </Form.Item>
                {
                    (type == 1 || type == 2 || type == 4) &&
                    <Form.Item
                        label={type === 4 ? '接口路径' : '路由地址'}
                        name="path"
                        rules={[{ required: true, message: '请输入' + (type === 4 ? '接口路径' : '路由地址') }]}
                    >
                        <Input placeholder={type === 4 ? '请输入接口路径' : '请输入路由地址'} />
                    </Form.Item>
                }
                {
                    type === 2 &&
                    <Form.Item
                        label="组件路径"
                        name="component"
                        rules={[{ required: true, message: '请输入组件路径' }]}
                    >
                        <Input placeholder="请输入组件路径" />
                    </Form.Item>

                }
                {
                    (type === 2 || type === 3) &&
                    <Form.Item
                        label="权限标志"
                        name="permission"
                        rules={[{ required: true, message: '请输入权限标志' }]}
                    >
                        <Input placeholder="请输入权限标志" />
                    </Form.Item>
                }
                {
                    type === 2 &&
                    <Form.Item
                        label="路由参数"
                        name="params"
                    >
                        <Input placeholder="请输入路由参数" />
                    </Form.Item>
                }
                <Form.Item
                    label="是否显示"
                    name="isShow"

                >
                    <Radio.Group name="isShow" onChange={onChangeType}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="菜单状态"
                    name="status"
                >
                    <Radio.Group name="status" onChange={onChangeType}>
                        <Radio value={true}>正常</Radio>
                        <Radio value={false}>禁用</Radio>
                    </Radio.Group>
                </Form.Item>

            </Form>
        </Modal>
    )
});
export default Page