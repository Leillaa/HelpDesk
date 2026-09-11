import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../../../lib/types/styles";


export const styles = createUseStyles({
    form: {
        marginBottom: '2rem',
    },
    exceptText : {
        fontSize: '1rem',
        display: 'block',
        color: (theme: ICustomThemeParams) => ''+ theme?.colorReqRed || 'red',
    }
})