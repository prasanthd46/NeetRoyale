import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {store} from "./Redux/Store.ts"
import App from './App.tsx'
import {Provider} from "react-redux"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
