import { $authHost } from "../..";
import { IRequest } from "../../../lib/types/interfaces";

const getAllByUserId
    : (id:number) 
    => any 
    = async (id)   => {
    const {data} = await $authHost.get('/app/applications_list/');
    return data; 
}

const getOneById
    : (id:number) 
    => any 
    = async (id)   => {
    console.log('RequestController.getOneById called with id:', id);
    console.log('Token from localStorage:', localStorage.getItem('token'));
    try {
        const response = await $authHost.get('/app/application_details/' + id + '/');
        console.log('API Response:', response);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

const getCommentsById
    : (id:number) 
    => any 
    = async (id)   => {
    const {data} = await $authHost.get('/app/comment_list/' + id + '/');
    return data; 
}


const createComment
    : (id: number, form:FormData) 
    => any 
    = async (id, form)   => {
    const {data} = await $authHost.post('/app/comment_create/' + id + '/', form);
    return data; 
}

const createOne
    : (form: FormData) 
    => any 
    = async (form)   => {
    const {data} = await $authHost.post('/app/create_application/', form);
    return data; 
}

const closeRequest
    : (id: number)
    => any
    = async (id)   => {
    const {data} = await $authHost.post('/app/delete/' + id + '/');
    return data;
}

export {
    getAllByUserId,
    getOneById,
    getCommentsById,
    createComment,
    closeRequest,
    createOne
}