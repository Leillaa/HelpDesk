import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";

import jss from 'jss'

export const styles = createUseStyles({


    pageNav : {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '2rem 1rem 1rem 1rem',
    },

    list : {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        columnGap: '2rem',
        maxHeight: (theme: ICustomThemeParams) =>  'calc(100vh - ' + (theme?.fsLg || 0) + ' - .5rem - 3rem - 2.5rem - 4.5rem)', 
        overflowY: 'scroll',
        paddingRight: '2rem',
        marginLeft: '2rem',
        paddingTop: '2rem',
        
    },

    

    tabInput : {
        display: 'none',
    },

    tabLabel : {
        backgroundColor: (theme: ICustomThemeParams) => ''+ theme?.colorBlue || 'blue',
        border: 'none',
        color: (theme: ICustomThemeParams) =>  ''+ theme?.colorWhite || 'blue',
        padding: '.5rem 1rem',
        marginBottom: '1.5rem',
        position: 'sticky',
        top: 0
    },

    '@media (max-width: 800px)': {
        list: {
            columnGap: '0.5rem',
        }
    },
    


})



export const stylesTabs = jss.createStyleSheet({
    shown: {
        display: 'grid',
    }
})