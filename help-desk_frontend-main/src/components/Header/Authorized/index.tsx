import { useNavigate } from "react-router-dom"
import { styles } from "../styles"
import { useContext } from "react"
import { UserContext } from "../../.."
import { PATHS } from "../../../lib/constants/routes"

const Authorized = ({...props})=>{
    const {
        customTheme,
    } = props
    const user = useContext(UserContext)

    const classes = styles(customTheme)
    const navigator = useNavigate()

    return(
        <header className={classes.header}>
        <div className={classes.container}>
            <div className={classes.logo} onClick={()=> (user?.getIsAuth) ? navigator(PATHS.REQUESTLIST) : navigator(PATHS.INDEX)}>HelpDesk</div>
            <div className={classes.logout} onClick={()=> { user!.logout();  navigator('/')}}>Exit</div>
        </div>
        </header>
    )
}

export default Authorized