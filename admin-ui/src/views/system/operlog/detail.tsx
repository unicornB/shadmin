import { EditComponentProps, EditMethods } from "@/common/typings/common";
import { SysOperLog } from "@/common/typings/sys_oper_log";
import { Descriptions, DescriptionsProps, Modal } from "antd";
import { FC, forwardRef, useEffect, useImperativeHandle, useState } from "react";


const Page: FC<EditComponentProps> = forwardRef<EditMethods, EditComponentProps>((props, ref) => {

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'UserName',
            children: 'Zhou Maomao',
        },
        {
            key: '2',
            label: 'Telephone',
            children: '1810000000',
        },
        {
            key: '3',
            label: 'Live',
            children: 'Hangzhou, Zhejiang',
        },
        {
            key: '4',
            label: 'Remark',
            children: 'empty',
        },
        {
            key: '5',
            label: 'Address',
            children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
        },
    ];
    const [itemsData, setItemsData] = useState<DescriptionsProps['items']>(items);
    useImperativeHandle(ref, (): any => ({
        resetForm: (formData: SysOperLog) => {
            if (Object.keys(formData).length === 0) {

            } else {
                const items: DescriptionsProps['items'] = [
                    {
                        key: '1',
                        label: '接口名称',
                        children: formData.optModule,
                        span: 3, // span = 2
                    },
                    {
                        key: '2',
                        label: '请求方法',
                        children: formData.optMethod,
                        span: 3,
                    },
                    {
                        key: '3',
                        label: '请求路径',
                        children: formData.optPath,
                        span: 3,
                    },
                    {
                        key: '4',
                        label: '请求IP',
                        children: formData.optIp,
                        span: 3, // span = 2
                    },
                    {
                        key: '5',
                        label: '请求参数',
                        children: formData.optParam,
                        span: 3, // span = 2
                    },
                    {
                        key: '6',
                        label: '返回参数',
                        children: formData.optData,
                        span: 3,
                    },
                    {
                        key: '7',
                        label: '操作状态',
                        children: formData.optCode == 200 ? '成功' : '失败',
                        span: 3,
                    },
                    {
                        key: '8',
                        label: '操作耗时',
                        children: formData.optTime,
                        span: 3,
                    },
                    {
                        key: '9',
                        label: '操作时间',
                        children: formData.createdAt,
                        span: 3,
                    },
                ];
                setItemsData(items)

            }

        },

    }));
    useEffect(() => {

        if (props.formData) {

        } else {

        }
    }, [])
    const onCancel = () => {
        props.onCancel!();
    }

    return (
        <Modal
            title={props.title}
            open={props.open}
            width={800}
            footer={null}
            onCancel={onCancel}
            okText={"确定"}
            cancelText={"取消"}
            forceRender={true}
            destroyOnClose={true}
        >
            <Descriptions size="small" bordered items={itemsData} />
        </Modal>
    )
});
export default Page