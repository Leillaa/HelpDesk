import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../../../lib/types/styles";


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
        // left: '10%',
        margin: 'auto',
        padding: '1.5rem',
        borderRadius: '10px',
        
    },

    image: {
        // width: 'calc(80vw - 4rem)',
        // height: 'auto',
        // height: 'calc(80vh - 4rem)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        maxHeight:  'calc(80vh - 4rem)',
        maxWidth: 'calc(80vw - 4rem)',

    },

    close : {
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        background: 'white',
        borderRadius: '50%',
        cursor: 'pointer'
    }
})