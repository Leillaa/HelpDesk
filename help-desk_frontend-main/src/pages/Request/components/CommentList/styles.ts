import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../../../lib/types/styles";


export const styles = createUseStyles({
    noUrgently : {
        backgroundColor: (theme: ICustomThemeParams) =>  '' + theme?.colorReqGray || 'gray' ,
    },
    urgently: {
        backgroundColor: (theme: ICustomThemeParams) =>  '' + theme?.colorReqRed || 'red' ,
    },
    done: {
        backgroundColor: (theme: ICustomThemeParams) =>  '' + theme?.colorReqGreen || 'green' ,

    },
    commentsH4: {
        fontWeight: 100,
    },
    p: {
        padding:  '1rem',
        borderRadius: '20px',
        width: 'fit-content',
        height: 'auto',
    },
})