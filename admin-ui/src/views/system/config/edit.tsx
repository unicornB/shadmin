
import { configAdd, configUpdate } from "@/common/service/api/config";
import { EditComponentProps, EditMethods } from "@/common/typings/common";
import { SysConfig } from "@/common/typings/sys_config";
import { Form, Input, message, Modal, Radio, } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC, forwardRef, useEffect, useImperativeHandle, useState } from "react";

const { TextArea } = Input;
const Page: FC<EditComponentProps> = forwardRef<EditMethods, EditComponentProps>((props, ref) => {
    const [form] = useForm();
    const [isEdit, setIsEdit] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    useImperativeHandle(ref, (): any => ({
        resetForm: (formData: any) => {
            form.setFieldsValue(formData);
            if (Object.keys(formData).length === 0) {
                form.resetFields();
                setIsEdit(false);
            } else {
                setIsEdit(true);
            }

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
            const request: SysConfig = values as SysConfig;
            const { data, error } = await configUpdate(request)
            if (!error) {
                message.success(data.msg)
                props.onSuccess!()
            } else {
                message.error(error.msg)
            }
        } else {
            const request: SysConfig = values as SysConfig;
            const { data, error } = await configAdd(request)
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
                name="configForm"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                autoComplete="off"
                onFinish={onFinish}
                initialValues={{ configType: true }}
            >
                {
                    isEdit &&
                    <Form.Item name="id">
                        <Input type="hidden" />
                    </Form.Item>
                }
                <Form.Item
                    label="参数名称"
                    name="configName"
                    rules={[{ required: true, message: '请输入参数名称' }]}
                >
                    <Input placeholder="请输入参数名称" />
                </Form.Item>
                <Form.Item
                    label="参数键名"
                    name="configKey"
                    rules={[{ required: true, message: '请输入参数键名' }]}
                >
                    <Input placeholder="请输入参数键名" />
                </Form.Item>
                <Form.Item
                    label="参数键值"
                    name="configValue"
                    rules={[{ required: true, message: '请输入参数键值' }]}
                >
                    <TextArea placeholder="请输入参数键值" rows={4} maxLength={2000} />
                </Form.Item>
                <Form.Item
                    label="系统内置"
                    name="configType"
                >
                    <Radio.Group name="configType">
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="备注"
                    name="remark"
                >
                    <TextArea placeholder="请输入备注" rows={4} maxLength={500} />
                </Form.Item>
            </Form>
        </Modal>
    )
});
export default Page