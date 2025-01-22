import Home from "@/views/Home"
//import { Navigate } from "react-router-dom"
import lazyLoad from "@/common/utils/router/lazyLoad"

const routes = [
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "/dashboard",
                element: lazyLoad("views/dashboard")
            },
            // {
            //     path: "/page2",
            //     element: lazyLoad("views/Page2")
            // },
            // {
            //     path: "/user/list",
            //     element: lazyLoad("views/User"),

            // }
        ]
    },
    {
        path: "/login",
        element: lazyLoad("views/Login"),
    },
    {
        path: "*",
        element: lazyLoad("views/errPage/404"),
    },
    {
        path: "/diy/page/create",
        element: lazyLoad("views/diy/create"),
    }
]
export default routes