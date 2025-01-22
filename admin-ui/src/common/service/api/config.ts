
import { SysConfig, SysConfigRequest } from "@/common/typings/sys_config";
import { request } from "../request";

//获取配置列表
export const configList = (params: SysConfigRequest) => {
    return request.get<{ data: { list: SysConfig[], total: number } }>("/admin/config/page", { params: params });
}
//添加配置
export const configAdd = (params: SysConfig) => {
    return request.post<{ msg: string }>("/admin/config/add", params);
}
//编辑配置
export const configUpdate = (params: SysConfig) => {
    return request.put<{ msg: string }>("/admin/config/update", params);
}
//删除配置
export const configDel = (id: number) => {
    return request.delete<{ msg: string }>("/admin/config/delete/" + id);
}
//根据key获取配置信息
export const getConfigInfo = (configKey: string) => {
    return request.get<{ data: SysConfig }>("/admin/config/info/" + configKey);
}
//根据key更新配置信息
export const updateByKey = (params: SysConfig) => {
    return request.put<{ code: number, msg: string }>("/admin/config/updateByKey", params);
}