import { IPageRequest } from "./base";

export interface SysFile {
    id: number,
    fileName: string,
    filePath: string,
    fileSize: number,// 文件大小
    fileType: string,
    host: string,
    storage: string,
    uploadType: string,
    cateId: number,
    showtool?: boolean,
    checked?: boolean,
    visible?: boolean,
    showReName?: boolean
    showDelete?: boolean
}

export interface SysFileRequest extends IPageRequest {
    fileName?: string;
    uploadType?: string;
    cateId?: number;
    fileType?: string;
}