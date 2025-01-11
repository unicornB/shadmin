import type { Dispatch } from "redux";
interface CountState {
    count: number;
}
interface Params {
    type: string;
    num: number;
}
interface Actions {
    [K: string]: any;
}

const store = {
    state: <CountState>{
        count: 0,
    },
    //同步
    actions: <Actions>{
        addCount(newState: CountState, action: Params) {
            newState.count += action.num ? action.num : 1;
        },
    },
    //异步
    asyncActions: <Actions>{
        asyncAddCount(commit: Dispatch, action: Params) {
            setTimeout(() => {
                commit({ type: "addCount", num: action.num });
            }, 1000);
        },
    },
};

export default store;
