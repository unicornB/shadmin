import {
    combineReducers,
    compose,
    applyMiddleware,
    legacy_createStore as createStore
} from "redux";
import userStore from "./user/reducer";
import menu from "./menu/reducer";
import auth from "./auth/reducer";
import { thunk } from "redux-thunk";
//import reducers from "./reducer.ts";
// 判断有没有__REDUX_DEVTOOLS_EXTENSION_COMPOSE__这个模块
//let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose //rt
//const store = createStore(reducer)
// 创建数据仓库
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 为了让浏览器正常使用redux-dev-tools插件
//const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
// 组合各个模块的reducer
const reducers = combineReducers({
    userStore,
    menu,
    auth
});

// 开启 redux-devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 把仓库数据，浏览器redux-dev-tools，还有reduxThunk插件关联在store中
const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk)),
);
export default store;