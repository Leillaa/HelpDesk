import React, { Component, FC, PropsWithChildren } from "react";
import { RouteObject } from "react-router-dom";
import Index from "../../pages/Index";
import Auth from "../../pages/Auth";
import Request from "../../pages/Request";
import NewRequest from "../../pages/NewRequest";
import RequestList from "../../pages/RequestList";
import { JsxElement } from "typescript";
import {styleVars} from '../../lib/constants/styles'
import PrivateRoute from "../../components/PrivateRoute";
import { roles } from "./roles";
import Error404 from "../../pages/Error404";
import PublicRoute from "../../components/PublicRoute";


export interface ICustomRoute {
    path:String,
    element?: any,//: FC<any>,
    children?: Array<ICustomRoute>,
    customTheme?: Object,
    errorElement?: any
}

// !!!!!!!!!!!!!!! Вынести пути в отдельный объект и парсить их для формирования

const customTheme = styleVars;

const logPrefix = '/admin'
export const PATHS = {
    INDEX : '/',
    LOGIN: '/login',
    REGISTRATION: '/registration',
    NEWREQUEST: logPrefix + '/newrequest',
    REQUESTLIST: logPrefix + '/requestlist',
    REQUEST: logPrefix + '/requestlist/request/'

}

export const   routes: ICustomRoute[] = [
    {
        path: PATHS.INDEX,
        element: <Index 
                customTheme = {customTheme} 
            />,
        // errorElement: <ErrorBoundary />
        // customTheme: customTheme // не работает
    },
    
    {
        path: PATHS.INDEX,
        element: <PublicRoute 
            customTheme = {customTheme} />,
        children: [
            {
                path: PATHS.LOGIN,
                element: <Auth  
                    customTheme = {customTheme} 
                    isLog={true}
                />,
                
            },
            {
                path: PATHS.REGISTRATION,
                element: <Auth  
                    customTheme = {customTheme} 
                    isLog={false}
                />,
            },
        ]
    },
    // {
    //     path: '/user',
    //     element: <PrivateRoute 
    //         customTheme = {customTheme} 
    //         roles = {[roles.User]} />,
    //     children: [
            
    //     ]
    // },
    {
        path: '/admin/newrequest',
        element: <PrivateRoute 
            customTheme = {customTheme}
            roles = {[roles.Admin, roles.User]} />,
        children: [
            {
                path: '/admin/newrequest',
                element: <NewRequest  
                    customTheme = {customTheme} 
                />
            },
        ]
    },
    {
        path: '/admin/requestlist',
        element: <PrivateRoute 
            customTheme = {customTheme}
            roles = {[roles.Admin, roles.User]} />,
        children: [
            {
                path: '/admin/requestlist',
                element: <RequestList  
                    customTheme = {customTheme} 
                />,
            },
        ]
    },
    {
        path: '/admin/requestlist/request/:id',
        element: <PrivateRoute 
            customTheme = {customTheme}
            roles = {[roles.Admin, roles.User]} />,
        children: [
            {
                path: '/admin/requestlist/request/:id',
                element: <Request  
                    customTheme = {customTheme} 
                 />
            },
        ]
    },
    {
        path: '*',
        element: <Error404  
            customTheme = {customTheme} 
        />,
        
    },
    

]


    