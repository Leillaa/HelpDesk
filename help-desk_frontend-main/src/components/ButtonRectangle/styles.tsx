import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";


export const styles = createUseStyles({
    button : {
        backgroundColor: (theme: ICustomThemeParams) => ''+ theme?.colorBlue || 'blue',
        border: 'none',
        color: (theme: ICustomThemeParams) => ''+ theme?.colorWhite || 'white',
        padding: '0.2rem 1rem',
        width:'fit-content',
        marginTop: "3rem",
        // fontSize: (theme: ICustomThemeParams) => ''+ theme?.fsMd || '1rem',


    },
})




