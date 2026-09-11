import React, { createContext, useContext, useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
// import Index from './pages/Index';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './routers/AppRouter/AppRouter';
import Header from './components/Header';
import { styleVars } from './lib/constants/styles';
import { UserContext } from '.';
import * as UserController from './http/controllers/UserController'
import { ExecException } from 'child_process';
import { Spinner } from 'react-bootstrap';




function App() {
  const customTheme = styleVars;
  const user = useContext(UserContext)

  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(()=>{
      // Простая проверка - если есть токен в localStorage, считаем пользователя авторизованным
      const token = localStorage.getItem('token');
      console.log('App.tsx - checking token:', token);
      
      if (token) {
        console.log('App.tsx - token found, setting user as authenticated');
        user!.setUser({
          user_id: 1, // можно поставить любой ID
          userName: 'User',
          role: 'User'
        });
        user!.setIsAuth(true);
      } else {
        console.log('App.tsx - no token found, user not authenticated');
        user!.setIsAuth(false);
      }
      
      setIsLoading(false);
  }, [])

  if (isLoading) {
    return <Spinner animation={'grow'} />
  }

  return (
    <div >
      {/* <Header customTheme={customTheme}/> */}
      <RouterProvider router={AppRouter()}/>
    </div>
  );
}

export default App;
