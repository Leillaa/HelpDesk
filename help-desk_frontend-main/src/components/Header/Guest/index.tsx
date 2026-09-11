import { useNavigate } from "react-router-dom"
import { styles } from "../styles"
import { PATHS } from "../../../lib/constants/routes"

const Guest = ({...props})=>{
    const {
        customTheme,
    } = props

    const classes = styles(customTheme)
    const navigator = useNavigate()

    return(
        <header className={classes.header}>
            <div className={classes.logo} onClick={()=> navigator(PATHS.INDEX)}>HelpDesk</div>
        </header>
    )
}

export default Guest