import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";


export const styles = createUseStyles({
    background : {
        width: '100vw',
        height: '100vh',
        background: '#0300088c',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 5
    },

    container : {
        background: 'white',
        // width: '80%',
        // height: '80%',
        width: 'fit-content',
        height: 'fit-content',
        position: 'relative',
        top: '10%',
        margin: 'auto',
        padding: '1.5rem',
        borderRadius: '10px',
        
    },


    close : {
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        background: 'white',
        borderRadius: '50%',
        cursor: 'pointer'
    },

    title : {
        borderBottom:  (theme: ICustomThemeParams) =>  '1px solid ' + theme?.colorWhite || '1px solid white' ,
        fontSize:  (theme: ICustomThemeParams) =>  (theme?.fsMd  as string) || '1.5rem',
        marginBottom: '1rem',
        paddingBottom: '1rem'
    },
    content : {
        
    },

    error : {
        backgroundColor:  (theme: ICustomThemeParams) =>  (theme?.colorReqRed as string) || 'white' ,
    },
    ok : {
        backgroundColor:  (theme: ICustomThemeParams) =>  (theme?.colorReqGreen as string) || 'white' ,
    },
    
    button : {
        border: 'none',
        borderRadius: '15px',
        padding: '0.2rem 1rem',
        width:'fit-content',
        marginTop: "3rem",
    },
})