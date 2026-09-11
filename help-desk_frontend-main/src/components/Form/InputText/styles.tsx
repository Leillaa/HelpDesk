import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../../lib/types/styles";


export const styles = createUseStyles({
    input : {
        outline: 'none',
        backgroundColor: (theme: ICustomThemeParams) => { 
            console.log(theme ); return ''+ theme?.colorGray || 'gray'},
        border: 'none',
        borderRadius: '20px',
        padding: '.5rem .5rem .5rem 1rem',
        width: '100%'
    },
    small : {
        width: '70%'
    },
    '@media (max-width: 400px)' : {
        small : {
            width: '100%'
        },

    }
})