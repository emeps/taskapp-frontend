import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ErrorPage } from './pages/ErrorPage'

const router = createBrowserRouter([
  {path: '/', element:<Home/>,errorElement:<ErrorPage/>},
  {path: '/login', element:<Login/>,errorElement:<ErrorPage/>},
  {path: '/register', element:<Register/>,errorElement:<ErrorPage/>},

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>,
)
