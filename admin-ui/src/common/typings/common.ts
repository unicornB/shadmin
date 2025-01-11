export interface EditComponentProps {
    readonly ref?: any; // 传递给子组件的ref
    open?: boolean;
    onCancel?: Function;
    onSuccess?: Function;
    formData?: object;
    isEdit?: boolean;
    title: string;
    treeData?: any[];
}
export interface EditMethods {
    resetForm: (form: object) => void;
    setTreeData: (data: any[]) => void;
}

export interface CommonPageRequest {
    page?: number;
    limit?: number;
}