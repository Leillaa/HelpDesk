export type IRequest = {
    id?:number,
    chat_id?: string,
    created?:  string,
    created_by?: number
    groups?:  string,
    mail?: false
    messages_id?:  string,
    name?:  string,
    priority?:  string,
    status?:  string,
    team?:  string,
    telegram?: boolean,
    text?:  string,
    comment_count?: number
}

export type IComment =  {
    // name?: string,
    comment?: {
        id?: number,
        application_id?: number,
        name?: string|number,
        body?: string,
        messages_id?: string,
        telegram?: boolean,
        created?: string | Date,
        chat_id?: number | null,
        mail?: boolean,
        username? : string
    },
    image?: string ,
}

export type IRequestAttechment =  {
    name: string,
        application: string,
        image: string,
        image_url?: string
}

export type IGaleryImage = {
    name?: string,
    image?: string,
    image_url?: string
}

export const CATEGORIES_REQ  = {
    0: {
        type: 'Web-request',
        name: 'ВЕБ'
    },
    1: {
        type: 'telegram',
        name: 'Телеграм'
    },
    2: {
        type: 'mail',
        name: 'Почта' 
    }
}