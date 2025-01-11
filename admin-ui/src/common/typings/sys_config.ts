import { IBase, IPageRequest } from "./base";

export interface SysConfig extends IBase {
    configName?: string;
    configKey?: string;
    configValue?: string;
    configType?: string;
    remark?: string;
}
export interface SysConfigRequest extends IPageRequest {
    configName?: string;
    configKey?: string;
}