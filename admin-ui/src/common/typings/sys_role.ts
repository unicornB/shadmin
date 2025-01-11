export interface SysRole {
    id?: number,
    name?: string,
    sort?: number,
    permission?: string
    status?: boolean
    createAt?: string
    updateAt?: string,
    menuIds?: number[]
}
export interface SysRoleRequest {
    name?: string;
    page?: number;
    limit?: number;
}