import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './routers/AppRouter/AppRouter';
import User from './store/user';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const UserContext = createContext<User | null>(null)

root.render(
  <UserContext.Provider value={new User()}>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </UserContext.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
