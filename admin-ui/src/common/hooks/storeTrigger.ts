import { useDispatch } from "react-redux";
import type { AnyAction } from "redux";
export const useStoreTrigger = () => {
    const dis = useDispatch();
    return {
        dispatch: dis,
        asyncDispatch: (action: AnyAction) => {
            dis({ commit: dis, ...action });
        },
    };
};