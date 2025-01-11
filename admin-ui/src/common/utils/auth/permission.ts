import { SysMenu } from "@/common/typings/sys_menu";

export const getButtonPermissions = (menus: SysMenu[]) => {
    const permissions = [] as string[];
    menus.forEach((menu) => {
        if (menu.type == 3) {
            permissions.push(menu.permission!)
        }
    })
    return permissions;
}