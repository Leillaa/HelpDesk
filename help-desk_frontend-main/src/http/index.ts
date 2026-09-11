// import axios from 'axios'
import axios, { AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

axios.defaults.baseURL = process.env.BASE_API_URL;

// для запросов без авторизации
const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})



// Для авторизованных запросов с headerauthorisation с токенами
const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
    
})

// ??????????????????????????????? Проверить входные параметры
const authInterceptor = async (config : InternalAxiosRequestConfig<AxiosRequestHeaders> ) => {
    const token = localStorage.getItem('token')
    console.log('Interceptor: token from localStorage:', token);
    if (token) {
        config.headers.authorization = `Token ${token}`  // Формат для DRF TokenAuthentication
        console.log('Interceptor: Added authorization header:', config.headers.authorization);
    }
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}
