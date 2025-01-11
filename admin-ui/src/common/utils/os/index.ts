//获取操作系统
export const getOS = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) {
        return "Windows";
    } else if (userAgent.indexOf("Mac") !== -1) {
        return "Mac";
    } else if (userAgent.indexOf("Linux") !== -1) {
        return "Linux";
    } else if (userAgent.indexOf("Android") !== -1) {
        return "Android";
    } else if (userAgent.indexOf("iPhone") !== -1) {
        return "iPhone";
    } else if (userAgent.indexOf("iPad") !== -1) {
    }
    return "Unknown";
};
//获取浏览器名称 比如chrome safari firefox
export const getBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") !== -1) {
        return "Chrome";
    } else if (userAgent.indexOf("Safari") !== -1) {
        return "Safari";
    } else if (userAgent.indexOf("Firefox") !== -1) {
        return "Firefox";
    } else if (userAgent.indexOf("Edge") !== -1) {
        return "Edge";
    } else if (userAgent.indexOf("Opera") !== -1) {
        return "Opera";
    } else if (userAgent.indexOf("MSIE") !== -1) {
        return "IE";
    }
    return "Unknown";
}