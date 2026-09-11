import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";
import Image from './images/login.svg'
import Image2 from './images/circles.svg'

export const styles = createUseStyles({
    mainHeader: {
        backgroundColor:  'var(--color-blue)',
        color: 'var(--color-white)',
        '& div' : {
            display: 'flex',
            justifyContent: 'center',
            padding: '.25rem',
            fontSize: (theme: ICustomThemeParams)=> '' + theme?.fsLg || 'auto' ,
        },
        '& .container' : {
            padding: '0 !important',
        }
    },
    mainPage: {
        minHeight: (theme: ICustomThemeParams) => 'calc(100vh -'+ (theme?.fsLg || 0) +' - .5rem - 16px)',
        position: 'relative',
        padding: '1.5rem 3rem',
        backgroundImage: 'url(.'+Image+')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '55%',
        backgroundPosition: 'calc(100% - 3rem) 1rem',
        height: (theme: ICustomThemeParams)=> 'calc(100vh - '+ (theme?.fsLg || '0') +' - .5rem - 16px - 3rem)'
    },
    regLogBtn: {
        backgroundColor:  (theme: ICustomThemeParams)=> '' + theme?.colorLtGreen || 'white',
        borderStyle: 'solid',
        borderWidth: '3px',
        borderColor: (theme: ICustomThemeParams)=> '' + theme?.colorGreen  || 'white',
        borderRadius: '50%',
        width: '25vh',
        height: '25vh',
        cursor: 'pointer',
    
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    
        fontSize: '2.5vh',
        fontWeight: 600,
        color: (theme: ICustomThemeParams)=> '' + theme?.colorGreen || 'blue',
    
        position: 'relative',
        top: '32vh',
        left: '35vh',

        '& a': {
            textDecoration: 'none',
            color: 'inherit'
        },
        '& div':  {zIndex: 2},
    },
    regLogCircles: {
        position: 'absolute',
        height: (theme: ICustomThemeParams)=> 'calc(100vh - '+ (theme?.fsLg || '0') +' - .5rem - 16px - 3rem)',
        width: (theme: ICustomThemeParams)=> 'calc(697*(100vh - '+ (theme?.fsLg || '0')  +' - .5rem - 16px - 3rem)/858)',
        backgroundImage: 'url(.' + Image2 + ')',
        backgroundSize: 'cover',
    },

    '@media (max-width: 1000px)' : {
        mainPage : {
            backgroundSize: '100%'
        },
        regLogCircles : {display: 'none'},
    
        regLogBtn : {
            borderRadius: '30px',
            width: 'fit-content',
            height: 'auto',
            padding: '0.5rem 3rem',
            position: 'unset',
            margin: 'auto',
        }
    }
})



