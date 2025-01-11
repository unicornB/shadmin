import { SysAdmin, SysAdminRequest } from "@/common/typings/sys_admin";
import { request } from "../request";
export function adminList(params: SysAdminRequest) {
    return request.get<{ data: { list: SysAdmin[], total: number } }>("/admin/admin/list", { params: params });
}
export function adminAdd(params: SysAdmin) {
    return request.post<{ code: number, msg: string }>("/admin/admin/add", params);
}
export function adminUpdate(params: SysAdmin) {
    return request.put<{ code: number, msg: string }>("/admin/admin/update", params);
}

export function adminDelete(id: number) {
    return request.delete<{ code: number, msg: string }>("/admin/admin/delete/" + id, {});
}