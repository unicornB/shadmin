export interface SysMenu {
    id: number
    name: string
    type: number
    parentId: number
    path?: string
    component?: string
    redirect?: string
    icon?: string
    sort?: number
    isRoute?: boolean
    isShow?: boolean
    isMenu?: boolean
    status?: boolean
    params?: string
    permission?: string
    remark?: string
    children?: SysMenu[];
}
