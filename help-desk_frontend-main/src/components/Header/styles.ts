import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";


// backgroundColor: (theme: ICustomThemeParams) =>  '' + theme?.colorReqGray || 'gray' ,

export const styles = createUseStyles({
    
    header: {
        backgroundColor:  (theme: ICustomThemeParams) =>  '' + theme?.colorBlue || 'gray' ,
        color:  (theme: ICustomThemeParams) =>  '' + theme?.colorWhite || 'gray' ,
        padding: '0 1rem',
    },

    logo : {
        fontSize:  (theme: ICustomThemeParams) =>  '' + theme?.fsLg || '2rem' ,
        cursor: 'pointer'
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontSize: (theme: ICustomThemeParams) =>  '' + theme?.fsMd || '2rem' ,
        padding: '.25rem',
    },
    menus: {
        cursor: 'pointer',
    },
    logout : {
        cursor: 'pointer',
    }
})