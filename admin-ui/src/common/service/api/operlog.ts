import { CommonPageRequest } from "@/common/typings/common";
import { request } from "../request";
import { SysOperLog } from "@/common/typings/sys_oper_log";


export function pageList(params: CommonPageRequest) {
    return request.get<{ data: { list: SysOperLog[], total: number } }>("/admin/operlog/page", { params: params });
}

export function clear() {
    return request.delete<{ code: number, msg: string }>("/admin/operlog/clear");
}