import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../../lib/types/styles";


export const styles = createUseStyles({

    inputFile : {
        position: 'relative',
        display: 'inline-block',
        width: '100%',
    },
    
    span : {
        cursor: 'pointer',
    
        backgroundColor: (theme: ICustomThemeParams) => ''+ theme?.colorGray || 'gray',
        border: 'none',
        borderRadius: '20px',
        padding: '.5rem .5rem .5rem 1rem',
        display: 'block',
        width:  '100%',
        textAlign: 'center',
    
    },
    
    input : {
        position: 'absolute',
        zIndex: -1,
        opacity: 0,
        display: 'block',
        width: 0,
        height: 0,
    }
})