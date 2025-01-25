
import { createRoot } from 'react-dom/client'
import "reset-css"
import "@/assets/styles/global.scss"
import "@/assets/fonts/remixicon.css"
import App from './App'
import { BrowserRouter } from 'react-router-dom'

//import Router from './router'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <Router />
//   </StrictMode>,
// )
// 状态管理
import { Provider } from "react-redux"
import store from "@/store"
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  // </StrictMode>,
)
