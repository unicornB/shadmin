// import store from "../store"
// //获取state 类型
// type RootState = ReturnType<typeof store.getState>
// 【重点】类型声明里面不要直接使用引入import...from...
// 而是使用 import("@/store") 这种语法
//全局声明
type RootState = ReturnType<typeof import("@/store").getState>
interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: Function;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
} 