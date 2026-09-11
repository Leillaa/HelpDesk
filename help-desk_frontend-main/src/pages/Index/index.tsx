import {styles} from './styles'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { PATHS } from '../../lib/constants/routes'


const Index = ({...props}) => {
    const {
        customTheme
    } = props
    const classes = styles(customTheme)

    const navigate = useNavigate();

    return (
        <>
            <Header customTheme={customTheme} />
            <main>
                <div className={classes.mainPage} id="main__page"> 
                    <div className={classes.regLogCircles} id="reg__log__circles"></div>
                    <div className={classes.regLogBtn} id="reg__log__btn">
                        <div onClick={()=>navigate(PATHS.LOGIN)}><a href="">Login<br />Registration</a></div>
                    </div>
                </div>
            </main>
        </>
    )
}


export default Index