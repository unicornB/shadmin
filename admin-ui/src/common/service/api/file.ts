import { SysFile, SysFileRequest } from "@/common/typings/sys_file";
import { request } from "../request";


export function pageList(params: SysFileRequest) {
    return request.get<{ data: { list: SysFile[], total: number } }>("/admin/file/page", { params: params });
}
export function reFileName(params: SysFile) {
    return request.put<{ msg: string }>("/admin/file/rename", params);
}
export function moveFile(params: { cateId: number, fileIds: string }) {
    return request.put<{ msg: string }>("/admin/file/move", params);
}
export function delFile(params: { fileIds: string }) {
    return request.post<{ msg: string }>("/admin/file/delete", params);
}