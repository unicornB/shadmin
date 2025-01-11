
import { request } from "../request";
import { AppAddRequest, AppListRequest, App } from "@/common/typings/app";

export function appAdd(params: AppAddRequest) {
    return request.post<{ data: string }>("/api/v1/admin/app/add", params);
}
export function appEdit(params: App) {
    return request.put<{ data: string }>("/api/v1/admin/app/edit", params);
}
export function appList(params: AppListRequest) {
    return request.get<{ total: number, list: App[] }>("/api/v1/admin/app/list", { data: params });
}
export function appPage(params: AppListRequest) {
    return request.get<{ total: number, list: App[] }>("/api/v1/admin/app/page", { params: params });
}
export function appDelete(id: number) {
    return request.delete<{ data: string }>("/api/v1/admin/app/delete/" + id);
}