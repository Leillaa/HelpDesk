import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";
import Image from './images/request_image.png'

export const styles = createUseStyles({
    page : {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
    
    },
    
    image : {
        height: (theme: ICustomThemeParams) =>  'calc(99vh - ' + (theme?.fsLg || 0) + ' - .5rem - 16px)',
        
        backgroundImage: 'url('+Image+')',
        backgroundPosition: '0 5vh',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
    
    },
    
    form : {
        padding: '2rem',
    },
    
    formDiv : {
        marginBottom: '2rem',
    },

    formLabel : {
        display: 'block',
        fontSize: (theme: ICustomThemeParams) =>  '' + theme?.fsMd || '1rem' ,
    },
    
    formTextarea : {
        minHeight: '10rem',
    },
    
    formButtonSubmit : {
        backgroundColor: (theme: ICustomThemeParams) =>  '' + theme?.colorBlue || 'blue' ,
        border: 'none',
        borderRadius: '15px',
        color: (theme: ICustomThemeParams) =>  '' + theme?.colorWhite || 'white' ,
        padding: '.2rem',
        minWidth: '40%',
        fontSize: (theme: ICustomThemeParams) =>  '' + theme?.fsMd || '1rem' ,
    
        marginTop: '3rem',
    },

    exceptText : {
        fontSize: '1rem',
        display: 'block',
        color: (theme: ICustomThemeParams) => ''+ theme?.colorReqRed || 'red',
    },

    
    '@media (max-width: 800px)' : {
        page : {
            display: 'block',
            position: 'relative',
        },
    
        image : {
            height: '29vw',
            width: '28vw',
            position: 'absolute',
            top: 0,
            right: '1rem',
        }
    },

    '@media (max-width: 400px)' : {
        content : {
            margin: '0.5rem',
        },
    
        image : {
            display: 'none',
        }
    },  

})