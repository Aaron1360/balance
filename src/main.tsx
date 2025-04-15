import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TableContextProvider } from "./context/TableContext";
import { RouterProvider } from 'react-router-dom';
import router from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TableContextProvider>
      <RouterProvider router={router}/>
    </TableContextProvider>
  </StrictMode>,
)
