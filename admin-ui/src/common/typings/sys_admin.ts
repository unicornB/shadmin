import { SysRole } from "./sys_role"

export interface SysAdmin {
    id?: number,
    username?: string,
    realName?: string,
    password?: string
    loginTime?: string
    loginIp?: string
    isAdmin?: boolean
    status?: boolean
    createAt?: string
    updateAt?: string
    role?: SysRole
}

export interface SysAdminRequest {
    username?: string;
    realName?: string;
    page?: number;
    limit?: number;
}