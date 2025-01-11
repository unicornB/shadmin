
import { adminAdd, adminUpdate } from "@/common/service/api/admin";
import { allList } from "@/common/service/api/role";

import { EditComponentProps, EditMethods } from "@/common/typings/common";
import { SysAdmin } from "@/common/typings/sys_admin";
import { SysRole } from "@/common/typings/sys_role";



import { Form, Input, message, Modal, Radio, Select, } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC, forwardRef, useEffect, useImperativeHandle, useState } from "react";


const Page: FC<EditComponentProps> = forwardRef<EditMethods, EditComponentProps>((props, ref) => {
    const [form] = useForm();
    const [isEdit, setIsEdit] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [roleList, setRoleList] = useState<any[]>([]);


    useImperativeHandle(ref, (): any => ({
        resetForm: (formData: any) => {
            form.setFieldsValue(formData);
            if (Object.keys(formData).length === 0) {
                form.resetFields();
                setIsEdit(false);
            } else {
                setIsEdit(true);

            }
            getRoleList();// 获取角色列表
        },

    }));
    useEffect(() => {

        if (props.formData) {
            form.setFieldsValue(props.formData);
        } else {
            form.resetFields();
        }
    }, [])
    const onCancel = () => {
        props.onCancel!();
    }
    const handleOk = async () => {
        form.submit();
    }
    const onFinish = async (values: any) => {
        setConfirmLoading(true);
        if (isEdit) {
            const request: SysAdmin = values as SysAdmin;
            const { data, error } = await adminUpdate(request)
            if (!error) {
                message.success(data.msg)
                props.onSuccess!()
            } else {
                message.error(error.msg)
            }
        } else {
            const request: SysAdmin = values as SysAdmin;
            const { data, error } = await adminAdd(request)
            if (!error) {
                message.success(data.msg)
                props.onSuccess!()
            } else {
                message.error(error.msg)
            }
        }
        setConfirmLoading(false);
    }
    const getRoleList = async () => {
        const { data, error } = await allList();
        if (!error) {
            let roleListData = data.data.map((item: SysRole) => {
                return {
                    label: item.name,
                    value: item.id
                }
            })
            setRoleList(roleListData);
        }
    }
    return (
        <Modal
            title={props.title}
            open={props.open}
            width={600}
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
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                autoComplete="off"
                onFinish={onFinish}
                initialValues={{ type: 1, isShow: true, status: true, roleId: "" }}
            >
                {
                    isEdit &&
                    <Form.Item name="id">
                        <Input type="hidden" />
                    </Form.Item>
                }
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input disabled={isEdit} placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input disabled={isEdit} placeholder="请输入密码" />
                </Form.Item>
                <Form.Item
                    label="真实姓名"
                    name="realName"
                    rules={[{ required: true, message: '请输入真实姓名' }]}
                >
                    <Input placeholder="请输入真实姓名" />
                </Form.Item>
                <Form.Item
                    label="用户状态"
                    name="status"
                >
                    <Radio.Group name="status">
                        <Radio value={true}>正常</Radio>
                        <Radio value={false}>禁用</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="所属角色"
                    name="roleId"
                    rules={[{ required: true, message: '请选择所属角色' }]}
                >
                    <Select placeholder="请选择所属角色" options={roleList} />
                </Form.Item>
            </Form>
        </Modal>
    )
});
export default Page