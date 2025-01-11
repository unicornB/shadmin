import type { Dispatch } from "redux";
interface CommonState {
    title: string//标题
    collapsed: boolean//左菜单栏是否收起
    breadcrumbData: any[]//面包屑数据
}
interface Params {
    type: string
    title: string;
    collapsed: boolean;
    breadcrumbData: any[]//面包屑数据
}
interface Actions {
    [K: string]: any;
}
const store = {
    state: <CommonState>{
        title: "工作台",
        collapsed: false,
        breadcrumbData: [{ title: '工作台' }]
    },
    //同步
    actions: <Actions>{
        setTitle(newState: CommonState, action: Params) {
            newState.title = action.title ? action.title : "工作台";
        },
        setCollapsed(newState: CommonState, action: Params) {
            newState.collapsed = action.collapsed!;
        },
        setBreadcrumbData(newState: CommonState, action: Params) {
            newState.breadcrumbData = action.breadcrumbData!;
        },
    },
    //异步
    asyncActions: <Actions>{
        asyncsetRoutes(commit: Dispatch, action: Params) {
            setTimeout(() => {
                //commit({ type: "addCount", routeList: action.routeList });
            }, 1000);
        },
    },
};

export default store;
