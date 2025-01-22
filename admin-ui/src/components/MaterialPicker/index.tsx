import { FC, forwardRef, useImperativeHandle, useRef } from "react";
import { Modal } from "antd";
import Material from "@/views/app/material"
import { SysFile } from "@/common/typings/sys_file";
export interface MaterialPickerProps {
    readonly ref?: any; // 传递给子组件的ref
    open?: boolean;
    onCancel?: Function;
    onSuccess?: Function;
    fileType?: string;
    limit?: number;
    hiddenUpload?: boolean;
}
export interface MaterialPickerMethods {
    getSelectedMaterial: () => SysFile[];
}
const MaterialPicker: FC<MaterialPickerProps> = forwardRef<MaterialPickerMethods, MaterialPickerProps>((props, ref) => {
    const childRef = useRef<MaterialPickerMethods>();
    useImperativeHandle(ref, (): any => ({
        getSelectedMaterial: () => {
            return childRef.current?.getSelectedMaterial();
        },
    }));
    const onCancel = () => {
        if (props.onCancel) {
            props.onCancel();
        }
    }
    const handleOk = () => {
        if (props.onSuccess) {
            let selectedMaterial: SysFile[] | undefined = childRef.current?.getSelectedMaterial();
            props.onSuccess(selectedMaterial);
        }
    }
    const getTitle = () => {
        let title = "选择图片"
        switch (props.fileType) {
            case "video":
                title = "选择视频"
                break;
            case "audio":
                title = "选择音频"
                break;
            case "file":
                title = "选择文件"
                break;
            default:
                title = "选择图片"
                break;
        }
        return title
    }
    return (
        <Modal
            title={getTitle()}
            open={props.open}
            width={1100}
            height={600}
            onCancel={onCancel}
            onOk={handleOk}
            okText={"确定"}
            cancelText={"取消"}
            forceRender={true}
            destroyOnClose={true}

        >
            <Material ref={childRef} fileType={props.fileType} limit={props.limit} />
        </Modal>
    )
})
export default MaterialPicker;