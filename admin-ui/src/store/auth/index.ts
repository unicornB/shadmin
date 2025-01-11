import type { Dispatch } from "redux";
interface AuthState {

    permissions: string[];
}
interface Params {
    type: string;
    permissions: string[];
}
interface Actions {
    [K: string]: any;
}

const store = {
    state: <AuthState>{
        permissions: [],
    },
    //同步
    actions: <Actions>{
        setPermissions(newState: AuthState, action: Params) {
            newState.permissions = action.permissions;
        },
    },
    //异步
    asyncActions: <Actions>{
        asyncsetPermissions(commit: Dispatch, action: Params) {
            setTimeout(() => {
                commit({ type: "setPermissions", permissions: action.permissions });
            }, 1000);
        },
    },
};

export default store;
