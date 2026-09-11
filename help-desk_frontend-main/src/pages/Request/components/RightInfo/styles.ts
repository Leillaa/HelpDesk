import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../../../lib/types/styles";

export const styles = createUseStyles({

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

    '@media (max-width: 700px)': {

        aboutRequest : {order: 1},
    },    
    
})
