import { createUseStyles } from "react-jss";
// import { ICustomThemeParams } from "../../lib/types/styles";

import jss from 'jss'

export const styles = createUseStyles({
    listDiv : {
        display: 'grid',
        gridTemplateColumns:  '1fr',
        rowGap: '2rem',
        height: 'fit-content',
        paddingBottom: '1rem'
    },

    '@media (max-width: 800px)': {
        listDiv : {
            gridColumnStart: 1,
            gridColumnEnd: 4,
            gridRowStart: 2,
            gridRowEnd: 2,
        }
      },
})