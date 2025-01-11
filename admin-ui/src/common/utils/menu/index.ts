import { Menu } from "@/common/typings/auth";
import { SysMenu } from "@/common/typings/sys_menu";


export const menuTree = (menuList: SysMenu[]): Menu[] => {
    let menus: Menu[] = [];
    menuList.forEach((item) => {
        if (item.parentId === 0 && item.status && item.isShow) {
            const menu = {
                label: item.name,
                path: item.path,
                key: "/" + item.path,
                icon: item.icon,
                page: item.component,
            } as Menu;
            const children = menuList.filter((child) => child.parentId === item.id && child.status && child.isShow);
            if (children.length > 0) {
                if (!menu.children) {
                    menu.children = []
                }
                children.forEach((child) => {
                    let key = `${item.path}/${child.path}`

                    const menuChild = {
                        label: child.name,
                        path: key,
                        key: "/" + key,
                        icon: child.icon,
                        page: child.component,
                    } as Menu;
                    menu.children?.push(menuChild);
                })
            }
            menus.push(menu);
        }
    })
    return menus;
};


export const genTreeData = (menus: SysMenu[], parentId: number = 0): SysMenu[] => {
    return menus
        .filter(item => item.parentId === parentId)
        .map(item => {
            let children = genTreeData(menus, item.id!)
            if (children.length > 0) {
                return {
                    ...item,
                    children: children
                }
            }
            return item
        });
}
