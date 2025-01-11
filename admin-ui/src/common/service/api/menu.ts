
import { request } from "../request";
import { SysMenu } from "@/common/typings/sys_menu";


export function menuAdd(params: SysMenu) {
    return request.post<{ msg: string }>("/admin/menu/add", params);
}
export function menuList() {
    return request.get<{ data: SysMenu[] }>("/admin/menu/list", {});
}

export function menuUpdate(params: SysMenu) {
    return request.put<{ msg: string }>("/admin/menu/update", params);
}

export function menuTree() {
    return request.get<{ data: SysMenu[] }>("/admin/menu/tree", {});
}
export function del(id: number) {
    return request.delete<{ msg: string, code: number }>("/admin/menu/delete/" + id, {});
}