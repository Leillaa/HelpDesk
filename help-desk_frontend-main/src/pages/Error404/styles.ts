import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";
import Image from './images/404.png'



export const styles = createUseStyles({
    container: {
        width: '100%',
        height: '80vh',
        backgroundImage: 'url('+ Image +')' ,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        paddingTop: '5rem'
    },
    oops: {
        fontSize: '3rem',
        textAlign: 'center',
        color: (theme: ICustomThemeParams) => ''+ theme?.colorReqRed || 'red',
        fontWeight: 600,
        position: 'relative',
        top: '2rem'
    },
    er404: {
        fontSize: '16rem',
        textAlign: 'center',
        color: (theme: ICustomThemeParams) => ''+ theme?.colorBlue || 'blue',
        fontWeight: 600

    },
    discription: {
        fontSize: '1.5rem',
        textAlign: 'center',        
        color: (theme: ICustomThemeParams) => ''+ theme?.colorReqRed || 'red',

    }
})