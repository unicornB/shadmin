import { MenuItem } from "@/common/typings/auth";
import { Menu } from "antd";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { getMenu } from "@/common/utils/auth";
import { menuTree } from "@/common/utils/menu";
import RemixIcon from "../RemixIcon";

import { useStoreTrigger } from "@/common/hooks";
const MainMenu: React.FC = () => {
    const navigateTo = useNavigate()
    const currentRoute = useLocation();
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [loaded, setLoaded] = useState(false);
    let firstOpenKey: string = "";
    const [openKeys, setOpenKeys] = useState<string[]>(firstOpenKey ? [firstOpenKey] : []);
    const StoreTrigger = useStoreTrigger();
    useEffect(() => {
        const fetchData = async () => {
            const data = getMenu();
            const menuData = menuTree(data) as MenuItem[];
            console.log("menuData", menuData);
            menuData!.forEach((item: any) => {
                item!.icon = <span><RemixIcon type={item!.icon} size={16} color="inherit" /></span>;
                if (item.children) {
                    item.children.forEach((child: any) => {
                        child.icon = <span style={{ marginRight: 2 }}><RemixIcon type={child.icon} size={16} color="inherit" /></span>;
                    })
                }
            })
            if (menuData) {
                setMenus(menuData);

                setOpenKeys([findInitKey(menuData, currentRoute.pathname)]);
            }
        };
        fetchData();
    }, [currentRoute.pathname]);
    const onMenuClick = (e: { key: string }) => {
        navigateTo(e.key)
        const breadcrumbData = getBreadcrumbData(e.key)
        StoreTrigger.dispatch({
            type: "setBreadcrumbData",
            breadcrumbData: breadcrumbData
        })
    }
    const onOpenChange = (keys: string[]) => {
        const finalKeys = keys[keys.length - 1] ? [keys[keys.length - 1]] : [];
        setOpenKeys(finalKeys);
    }
    function findInitKey(menus: MenuItem[], path: string): string {
        const item: MenuItem = menus?.find((item) =>
            path.includes(item!.key as string),
        ) as MenuItem;
        return item?.key as string;
    }
    function getTitle(key: string) {
        const data = getMenu();
        const menuData = menuTree(data);
        let title = ""
        menuData.forEach((item) => {
            if (item.key === key) {
                title = item.label
            }
            if (item.children) {
                item.children.forEach((child) => {
                    if (child.key === key) {
                        title = item.label + "/" + child.label
                    }
                })
            }
        })
        return title
    }
    function getBreadcrumbData(key: string): any[] {
        const data = getMenu();
        const menuData = menuTree(data);
        let bData: any[] = []
        menuData.forEach((item) => {
            if (item.key === key) {
                bData.push({ title: item.label })
            }
            if (item.children) {
                item.children.forEach((child) => {
                    if (child.key === key) {
                        bData.push({ title: item.label })
                        bData.push({ title: child.label })
                    }
                })
            }
        })
        console.log("bData", JSON.stringify(bData))
        return bData
    }
    let selectKey = currentRoute.pathname === "/" ? "/dashboard" : currentRoute.pathname
    const title = getTitle(selectKey)
    const breadcrumbData = getBreadcrumbData(selectKey)
    if (title && title !== document.title) {
        document.title = title
        if (!loaded) {
            StoreTrigger.dispatch({
                type: "setBreadcrumbData",
                breadcrumbData: breadcrumbData
            })
            setLoaded(true)
        }
    }
    return (
        <Menu
            theme="dark"
            defaultSelectedKeys={[selectKey]}
            selectedKeys={[selectKey]}
            mode="inline"
            items={menus}
            onClick={onMenuClick}
            openKeys={openKeys}
            onOpenChange={(keys) => onOpenChange(keys)}
        />
    )
}
export default MainMenu