import { useLocation, useNavigate, useRoutes } from "react-router-dom";


import routes from "./router";
import { ReactNode, useEffect } from "react";
import { message } from "antd";
import { getButtonPermissions, getMenu, getToken } from "./common/utils/auth";
import lazyLoad from "./common/utils/router/lazyLoad";
import { menuTree } from "./common/utils/menu";
import { useStoreTrigger } from "@/common/hooks";
import { lazy } from "@loadable/component";
const App = () => {
  // 去往登录页的组件
  function ToLogin() {
    const navigateTo = useNavigate();
    useEffect(() => {
      navigateTo("/login");
      message.warning("您还没有登录，请登录后再访问！");
    }, [navigateTo]);
    return <div></div>;
  }

  // 去往首页的组件
  function ToHome() {
    const navigateTo = useNavigate();
    useEffect(() => {
      navigateTo("/");
      message.warning("您已经登录过了！");
    }, [navigateTo]);
    return <div></div>;
  }

  function BeforeRouterEnter() {
    const location = useLocation();
    const token = getToken();
    //1、如果访问的是登录页面， 并且有token， 跳转到首页
    if (location.pathname === "/login" && token) {
      // 这里不能直接用 useNavigate 来实现跳转 ，因为需要BeforeRouterEnter是一个正常的JSX组件
      return <ToHome />;
    }
    //2、如果访问的不是登录页面，并且没有token， 跳转到登录页
    if (location.pathname !== "/login" && !token) {
      return <ToLogin />;
    }
    let routeList = [...routes]
    //let index = routeList.findIndex((item) => item.path == "/")
    let menu = getMenu()
    //按钮权限状态设置
    let permissions = getButtonPermissions(menu)
    const storeTrigger = useStoreTrigger();
    storeTrigger.dispatch({
      type: "setPermissions",
      permissions: permissions
    })
    const menuData = menuTree(menu)
    let newHomeRoutes: { path: string; element: ReactNode; }[] = []
    if (menuData && menuData.length > 0) {
      menuData.forEach((item) => {
        if (item.page) {
          //const el = lazy(() => import(/* @vite-ignore */`@/views/${item.page}`))
          newHomeRoutes.push({ path: item.path, element: lazyLoad(lazy(() => import(/* @vite-ignore */`./views/${item.page}`))) })
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach((child) => {
            //const el = lazy(() => import(/* @vite-ignore */`@/views/${child.page}`))
            newHomeRoutes.push({ path: child.path, element: lazyLoad(lazy(() => import(/* @vite-ignore */`./views/${child.page}`))) })
          })
        }
      })
    }
    //routeList[index].children = newHomeRoutes
    //routeList = [...routeList, ...newHomeRoutes]
    const outlet = useRoutes(routeList)
    return outlet;
  }

  return (
    <BeforeRouterEnter />
  )
}
export default App
