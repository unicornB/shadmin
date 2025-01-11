

import { add, getMenuByRoleId, update } from "@/common/service/api/role";
import { EditComponentProps, EditMethods } from "@/common/typings/common";
import { SysRole } from "@/common/typings/sys_role";



import { Form, Input, InputNumber, message, Modal, Radio, Tree, TreeDataNode, TreeProps } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC, forwardRef, useEffect, useImperativeHandle, useState } from "react";


const Page: FC<EditComponentProps> = forwardRef<EditMethods, EditComponentProps>((props, ref) => {
    const [form] = useForm();
    const [isEdit, setIsEdit] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([3]);

    useImperativeHandle(ref, (): any => ({
        resetForm: (formData: any) => {
            initTreeData();
            form.setFieldsValue(formData);
            if (Object.keys(formData).length === 0) {
                form.resetFields();
                setIsEdit(false);
            } else {
                setIsEdit(true);
                //获取菜单
                getMenus(formData.id);//获取权限
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
            const request: SysRole = values as SysRole;
            request.menuIds = checkedKeys as number[];
            const { data, error } = await update(request)
            if (!error) {
                message.success(data.msg)
                props.onSuccess!()
            } else {
                message.error(error.msg)
            }
        } else {
            const request: SysRole = values as SysRole;
            request.menuIds = checkedKeys as number[];
            const { data, error } = await add(request)
            if (!error) {
                message.success(data.msg)
                props.onSuccess!()
            } else {
                message.error(error.msg)
            }
        }
        setConfirmLoading(false);
    }
    const initTreeData = () => {
        const oTreeData: TreeDataNode[] = props.treeData! as TreeDataNode[];
        setTreeData(oTreeData);
    }
    const onCheck: TreeProps['onCheck'] = (checkedKeys, { halfCheckedKeys }) => {
        const checkedKeysArray = checkedKeys as React.Key[];
        //let concatTreeData = checkedKeysArray.concat(halfCheckedKeys!)
        setCheckedKeys(checkedKeysArray);
    };
    const getMenus = async (id: number) => {
        const { data, error } = await getMenuByRoleId(id);
        if (!error) {
            const menuIds = data.data.map((item: any) => item.menuId);
            setCheckedKeys(menuIds);
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
                initialValues={{ type: 1, isShow: true, status: true }}
            >
                {
                    isEdit &&
                    <Form.Item name="id">
                        <Input type="hidden" />
                    </Form.Item>
                }
                <Form.Item
                    label="角色名称"
                    name="name"
                    rules={[{ required: true, message: '请输入角色名称' }]}
                >
                    <Input placeholder="请输入角色名称" />
                </Form.Item>
                <Form.Item
                    label="权限字符"
                    name="permission"
                    rules={[{ required: true, message: '请输入权限字符' }]}
                >
                    <Input placeholder="请输入权限字符" />
                </Form.Item>
                <Form.Item
                    label="排序"
                    name="sort"
                    rules={[{ required: true, message: '请输入排序' }]}
                >
                    <InputNumber min={0} placeholder="请输入排序" />
                </Form.Item>
                <Form.Item
                    label="角色状态"
                    name="status"
                >
                    <Radio.Group name="status">
                        <Radio value={true}>正常</Radio>
                        <Radio value={false}>禁用</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="权限菜单"
                    name="permission"
                    rules={[{ required: true, message: '请输入权限字符' }]}
                >
                    <Tree
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                        checkable
                        onCheck={onCheck}
                        checkedKeys={checkedKeys}
                        fieldNames={{ title: 'name', key: 'id' }}
                        treeData={treeData}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
});
export default Page