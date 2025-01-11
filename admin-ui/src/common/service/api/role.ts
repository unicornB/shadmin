
import { request } from "../request";
import { SysRole, SysRoleRequest } from "@/common/typings/sys_role";
export function pageList(params: SysRoleRequest) {
    return request.get<{ data: { list: SysRole[], total: number } }>("/admin/role/list", { params: params });
}
export function add(params: SysRole) {
    return request.post<{ msg: string }>("/admin/role/add", params);
}
export function update(params: SysRole) {
    return request.put<{ msg: string }>("/admin/role/update", params);
}
export function del(id: number) {
    return request.delete<{ msg: string }>("/admin/role/delete/" + id, {});
}
export function getMenuByRoleId(id: number) {
    return request.get<{ data: any[] }>("/admin/role/menu/" + id, {});
}
export function allList() {
    return request.get<{ data: SysRole[] }>("/admin/role/alllist", {});
}