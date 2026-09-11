import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";

export const styles = createUseStyles({

    image : {
        height: (theme: ICustomThemeParams) =>  'calc(99vh - ' + (theme?.fsLg || 0) + ' - .5rem - 16px)',
        
        backgroundImage: 'url(.'+ Image +')',
        backgroundPosition: '0 5vh',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
    
    },
    formLabel : {
        display: 'block',
        fontSize: (theme: ICustomThemeParams) =>  '' + theme?.fsMd || '1rem' ,
    },





    
    page : {
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
    },

    noUrgently : {
        backgroundColor: (theme: ICustomThemeParams) =>  '' + theme?.colorReqGray || 'gray' ,
    },
    urgently: {
        backgroundColor: (theme: ICustomThemeParams) =>  '' + theme?.colorReqRed || 'red' ,
    },
    done: {
        backgroundColor: (theme: ICustomThemeParams) =>  '' + theme?.colorReqGreen || 'green' ,

    },

    aboutRequest: {
        // backgroundColor: var(--curr-req-color);
        padding: '2rem 1rem',
        fontSize:  (theme: ICustomThemeParams) =>  '' + theme?.fsMd || '1rem' ,
    },
    aboutRequestDiv: {
        marginBottom: 'calc(2rem + .9vw)',
    },
    aboutRequestDivDiv : {
        fontWeight: 600,
    },

    p: {
        padding:  '1rem',
        borderRadius: '20px',
        width: 'fit-content',
        height: 'auto',
    },

    content: {
        margin: '2rem',
    },
    h4: {
        marginTop: '2rem',
    },

    '@media (max-width: 700px)': {
        page : {
            gridTemplateColumns: '1fr',
        },
        aboutRequest : {order: 1},
        content : {order: 2},
        p : {
            maxWidth: '100%'
        }
    },
    '@media (max-width: 400px)': {
        content : {
            margin: '0.5rem'
        }
    },

    

})
