import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";
import Image2 from './images/reg_log_image.png'



export const styles = createUseStyles({
    regLogPage: {
        minHeight: (theme:ICustomThemeParams) => 'calc(99vh - '+ theme?.fsLg || 0 +' - .5rem - 16px)' ,
        position: 'relative',
        paddingTop: '1px',
    },
    regLogForm : {
        padding: '1rem 2rem 3rem 2rem',
        width: '40%',
        borderColor: (theme: ICustomThemeParams) => ''+ theme?.colorBlue || 'blue',
        borderWidth: '2px',
        borderRadius: '30px',
        borderStyle: 'solid',
        fontSize: (theme: ICustomThemeParams) => ''+ theme?.fsMd || '1rem',
        marginTop: '10rem',
        marginLeft: '10vw',
    },
    
    regLogFormH2 : {
        fontSize:(theme: ICustomThemeParams) => ''+ theme?.fsMd || '1rem',
        textAlign: 'center',
    },

    regLogFormElements : {
        display: 'grid',
        gridTemplateColumns: '1fr 8fr',
        gridColumnGap: '2rem',
        gridRowGap: '2rem',
        marginTop: '3rem',
        marginBottom: '3rem',
    },
    
    regLogFormElementsLabel :{
        textAlign: 'right'
    
    },

    regLogFormButton: {
        backgroundColor: (theme: ICustomThemeParams) => ''+ theme?.colorBlue || 'blue',
        border: 'none',
        borderRadius: '15px',
        color: (theme: ICustomThemeParams) => ''+ theme?.colorWhite || 'white',
        padding: '.2rem',
        minWidth: '40%',
    },
    
    regLogImage : {
        height: '65vh',
        width: '50%',
    
        position: 'absolute',
        right: '3rem',
        top: '13vh',
    
        backgroundImage: 'url(.'+ Image2 +')' ,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
    
    },

    regisration : {
        borderRadius: '70px',
        marginTop: '3rem',
        padding: '3rem 3rem',
    },

    '@media (max-width: 1320px)' : {
        regLogForm : {
            width: '70%',
            margin: 'auto',
            marginTop: '3rem'
    
        },
        regLogImage : {
            height: '29vh',
            width: '31%',
            right: 'calc(-69%)',
            position: 'relative',
            top: '-24vh',
        }
    },

    '@media (max-width: 1000px)' : {
        regLogImage : {
            position: 'unset',
            margin: 'auto',
            marginTop: '3rem'
        },
    
        regLogForm : {
            width: 'auto',
            margin: '3rem 1rem',
        }
        
    },
    '@media (max-width: 520px)' : {
        regisration : {
            padding: '4vw'
        },
        regLogFormElements : {
            gridColumnGap: '4vw'
        }
    },
    '@media (max-width: 450px)' : {
        regLogFormElements : {
            gridTemplateColumns: '1fr',
            gridRowGap: '0.25rem',
            marginTop: '1rem',
            marginBottom: '1rem',
        },
        regLogFormElementsLabel : {
            textAlign: 'left',
            marginLeft: '.25rem',
            marginTop: '1rem'
        },
        regLogImage : {
            width: '60vw',
            height: '60vw'
        }
    },
    // '@media (max-width: 330px)' : {

    // },

    exceptText : {
        fontSize: '1rem',
        display: 'block',
        color: (theme: ICustomThemeParams) => ''+ theme?.colorReqRed || 'red',
    }
})
    
