import { request } from "../request";
import { SysFileCate } from "@/common/typings/sys_file_cate";

//添加文件分组
export function fileCateAdd(params: SysFileCate) {
    return request.post<{ msg: string }>("/admin/filecate/create", params);
}
//获取文件分组列表
export function fileCateList(params: { type: string }) {
    return request.get<{ data: SysFileCate[] }>("/admin/filecate/list", { params: params });
}
//删除文件分组
export function fileCateDelete(id: number) {
    return request.delete<{ code: number, msg: string }>("/admin/filecate/delete/" + id);
}
//修改文件分组
export function fileCateUpdate(params: SysFileCate) {
    return request.put<{ msg: string }>("/admin/filecate/update", params);
}