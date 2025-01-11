export interface RemixIconProps {
    type: string,
    size?: number,
    color?: string,
    onClick?: () => void
}
const RemixIcon: React.FC<RemixIconProps> = (props: RemixIconProps) => {
    let iconClass = props.type.startsWith('ri-') ? props.type : `ri-${props.type}`
    return (
        <i onClick={props.onClick} className={iconClass} style={{
            fontSize: props.size || 25,
            color: props.color || '#333333',
        }}></i>
    )
}
export default RemixIcon