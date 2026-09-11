import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";


export const styles = createUseStyles({
    icon : {
        position: 'absolute',
        right: '-10px',
        top: '-10px',
        zIndex: 10,
        color:  (theme: ICustomThemeParams) =>  '' + (theme?.colorReqRed || 'red'), 
        backgroundColor: (theme: ICustomThemeParams) =>  '' + (theme?.colorWhite || 'white'),
        borderRadius: '50%',
        border: '1px solid white'
    },
})