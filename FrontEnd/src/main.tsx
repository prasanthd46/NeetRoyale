import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Auth0ProviderWithHistory from "./auth/authProvider"
import {store} from "./Redux/Store.ts"
import App from './App.tsx'
import {Provider} from "react-redux"
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './providers/socketProvider.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithHistory>
       <Provider store={store}>
        <SocketProvider>
         <App />
          </SocketProvider>
        </Provider>
       </Auth0ProviderWithHistory>
    </BrowserRouter>
  </StrictMode>,
)
