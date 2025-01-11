import handleState from "./index";
import type { AnyAction, Dispatch } from "redux";
type AnyActions = AnyAction & { commit?: Dispatch };

// 管理数据
const reducer = (state = { ...handleState.state }, action: AnyActions) => {
    const newState = JSON.parse(JSON.stringify(state));
    const actions = Object.keys({
        ...handleState.actions,
        ...handleState.asyncActions,
    });
    for (let i = 0; i < actions.length; i++) {
        if (action.type === actions[i]) {
            !action.commit
                ? handleState.actions[actions[i]](newState, action)
                : handleState.asyncActions[actions[i]](action.commit, action);
            break;
        }
    }
    return newState;
};
export default reducer;
