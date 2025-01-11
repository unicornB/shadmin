import type { Dispatch } from "redux";
interface RouteState {
    routeList: any[];
}
interface Params {
    type: string;
    routeList: any[];
}
interface Actions {
    [K: string]: any;
}
const store = {
    state: <RouteState>{
        routeList: [],
    },
    //同步
    actions: <Actions>{
        setRoutes(newState: RouteState, action: Params) {
            newState.routeList = action.routeList;
        },
    },
    //异步
    asyncActions: <Actions>{
        asyncsetRoutes(commit: Dispatch, action: Params) {
            setTimeout(() => {
                commit({ type: "addCount", routeList: action.routeList });
            }, 1000);
        },
    },
};

export default store;
