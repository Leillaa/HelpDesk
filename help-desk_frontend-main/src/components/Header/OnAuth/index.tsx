import { useNavigate } from "react-router-dom"
import { styles } from "../styles"
import { useContext } from "react"
import { UserContext } from "../../.."
import { PATHS } from "../../../lib/constants/routes"

const OnAuth = ({...props})=>{
    const {
        customTheme,
        toReg,
        onclickEvent
    } = props

    const user = useContext(UserContext)
    const classes = styles(customTheme)
    const navigator = useNavigate()

    return(
        <header className={classes.header}>
            <div className={classes.container}>
                <div className={classes.logo} onClick={()=> (user?.getIsAuth) ? navigator(PATHS.REQUESTLIST) : navigator(PATHS.INDEX)}>HelpDesk</div>
                <div onClick={()=>onclickEvent()}> {(toReg)?'Registration':'Authorization'}</div>
            </div>
        </header>
    )
}

export default OnAuth