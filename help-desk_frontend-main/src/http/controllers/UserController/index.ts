import { jwtDecode } from "jwt-decode";
import { $authHost, $host } from "../..";
import User from "../../../store/user";

const authorization
    : (form: {username: string, password: string}) 
    => any 
    = async (form)   => {
    const {data} = await $host.post('/api/auth/api/login/', {
        email: form.username,  // username с формы -> email в API
        password: form.password
    });
    await localStorage.setItem('token' , data.token)
    return { id: data.user_id}
}

const registration 
    : (form: { 
        username: string, 
        email:string, 
        password: string}) 
    => any 
    = async (form)   => {
    const {data} = await $host.post('/api/register/', form);
    await localStorage.setItem('token' , data.token)
    return { id: data.user_id}
}

const getById 
    : (id:number) 
    => any 
    = async (id)   => {
    const {data} = await $authHost.get('/api/user/' + id);
    return data; 
}

const check : () => any
    = async () => {
    console.log('UserController.check called');
    console.log('Token from localStorage:', localStorage.getItem('token'));
    
    // Проверяем, есть ли токен в localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    
    const {data} = await $authHost.post('/api/check/');
    console.log('Check API response:', data);
    return { 
        id: data.user_id,
        username: data.username
    }
} 

export  {
    authorization,
    registration,
    getById,
    check
}