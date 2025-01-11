import { CommonPageRequest } from "@/common/typings/common";
import { request } from "../request";
import { SysLoginLog } from "@/common/typings/sys_login_log";

export function pageList(params: CommonPageRequest) {
    return request.get<{ data: { list: SysLoginLog[], total: number } }>("/admin/loginlog/page", { params: params });
}
/**
 * 
 * @returns 删除登录日志
 */
export function clear() {
    return request.delete<{ code: number, msg: string }>("/admin/loginlog/clear");
}