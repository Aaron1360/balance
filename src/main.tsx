import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppContextProvider } from "./context/AppContext";
import { RouterProvider } from 'react-router-dom';
import router from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContextProvider>
      <RouterProvider router={router}/>
    </AppContextProvider>
  </StrictMode>,
)
