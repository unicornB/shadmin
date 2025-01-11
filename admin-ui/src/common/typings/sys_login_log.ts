
export interface SysLoginLog {
    /**
     * 登录日志id
     */
    id?: number;
    /**
     * 用户id
     */
    username?: number;
    /**
     * 登录时间
     */
    createAt?: string;
    /**
     * 登录ip
     */
    ip?: string;
    /**
     * 登录Os系统
     */
    os?: string;
    /**
     * 登录浏览器
     */
    browser?: string;
    /**
     * 登录状态
     */
    status?: boolean;
    /**
     * 登录状态描述
     */
    msg?: string;
}