import { useSelector } from 'react-redux';
export interface PermissionButtonProps {
    permission: string,
    children?: React.ReactNode,
}
//按钮权限组件
const PermissionButton: React.FC<PermissionButtonProps> = (props: PermissionButtonProps) => {
    const permissions = useSelector((state: RootState) => state.auth.permissions);
    return permissions.includes(props.permission) ? props.children : null;
}
export default PermissionButton