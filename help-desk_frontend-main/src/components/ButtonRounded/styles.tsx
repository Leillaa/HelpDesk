import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";


export const styles = createUseStyles({
    button : {
        backgroundColor: (theme: ICustomThemeParams) => ''+ theme?.colorBlue || 'blue',
        border: 'none',
        borderRadius: '15px',
        color: (theme: ICustomThemeParams) => ''+ theme?.colorWhite || 'white',
        padding: '0.2rem 1rem',
        // minWidth: '40%',
        width:'fit-content',
        marginTop: "3rem",
        fontSize: (theme: ICustomThemeParams) => ''+ theme?.fsMd || '1rem',

        // display: 'flex'
    },
})





// background-color: var(--color-blue);
// border: none;
// border-radius: 15px;
// color: var(--color-white);
// padding: 0.2rem;
// min-width: 40%;
// font-size: var(--fs-md);