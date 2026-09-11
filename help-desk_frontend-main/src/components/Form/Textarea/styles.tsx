import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../../lib/types/styles";


export const styles = createUseStyles({
    textarea : {
        outline: 'none',
        backgroundColor: (theme: ICustomThemeParams) => ''+ theme?.colorGray || 'gray',
        border: 'none',
        width: '100%',
        borderRadius: '20px',
        padding: '.5rem .5rem .5rem 1rem',
    }
})