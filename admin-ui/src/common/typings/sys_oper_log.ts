import { IBase, IPageRequest } from "./base";

export interface SysOperLog extends IBase {
    optMethod?: string;
    optModule?: string;
    optIp?: string;
    optAdmin?: string;
    optCode?: number;
    optMsg?: string;
    optData?: string;
    optTime?: string;
    optParam?: string;
    optPath?: string;
}
export interface SysOperLogRequest extends IPageRequest {
    optMethod?: string;
    optModule?: string;
    optAdmin?: string;
    optCode?: number;
    optPath?: string;
}