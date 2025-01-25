import Home from "@/views/Home"
//import { Navigate } from "react-router-dom"
import lazyLoad from "@/common/utils/router/lazyLoad"
import { lazy } from "@loadable/component"


const routes = [
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "/dashboard",
                element: lazyLoad(lazy(() => import("../views/dashboard")))
            },
            {
                path: "/system/user",
                element: lazyLoad(lazy(() => import("../views/system/user")))
            },
            {
                path: "/system/role",
                element: lazyLoad(lazy(() => import("../views/system/role")))
            },
            {
                path: "/system/menu",
                element: lazyLoad(lazy(() => import("../views/system/menu")))
            },
            {
                path: "/system/config",
                element: lazyLoad(lazy(() => import("../views/system/config")))
            },
            {
                path: "/system/optlog",
                element: lazyLoad(lazy(() => import("../views/system/operlog")))
            },
            {
                path: "/system/loginlog",
                element: lazyLoad(lazy(() => import("../views/system/loginlog")))
            },
            //应用管理
            {
                path: "/app/material",
                element: lazyLoad(lazy(() => import("../views/app/material")))
            },
            {
                path: "/app/policy",
                element: lazyLoad(lazy(() => import("../views/app/policy")))
            },
            //装修
            {
                path: "/diy/material",
                element: lazyLoad(lazy(() => import("../views/app/material")))
            }
        ]
    },
    {
        path: "/login",
        element: lazyLoad(lazy(() => import("../views/Login"))),
    },
    {
        path: "*",
        // element: lazyLoad("@/views/errPage/404"),
        element: lazyLoad(lazy(() => import("../views/errPage/404"))),
    },
    {
        path: "/diy/page/create",
        // element: lazyLoad("@/views/diy/create"),
        element: lazyLoad(lazy(() => import("../views/diy/create"))),
    }
]
export default routes