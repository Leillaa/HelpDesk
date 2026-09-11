import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../../../lib/types/styles";

export const styles = createUseStyles({

    requestItem: {
        padding: '1rem 0',
        borderRadius: '20px',
        color: (theme: ICustomThemeParams) =>  '' + (theme?.colorWhite || 'white'), 
        cursor: 'pointer',
        position: 'relative'
    },

    requestItemDiv : {
        padding: '0 1rem',
    },

    noUrgently :  {
         backgroundColor: (theme: ICustomThemeParams) =>  '' + (theme?.colorReqGray || 'gray'), // var(--color-req-gray);
    },

    urgently : {
        backgroundColor: (theme: ICustomThemeParams) =>  '' + (theme?.colorReqRed || 'red'),
    },

    done : {
        backgroundColor: (theme: ICustomThemeParams) =>  '' + (theme?.colorReqGreen || 'green'), 
    },

    itemHr : {
        borderWidth: '1px',
        borderColor: (theme: ICustomThemeParams) =>  '' + (theme?.colorWhite || 'white'), 
        opacity: 1,
        margin: '.5rem 0',
    },
})