import { useRouteError } from "react-router-dom";
import { styles } from "./styles"
import Header from "../../components/Header";


const Error404 = ({...props}) => {
    const {
        customTheme
    } = props
    const classes = styles(customTheme)
    
    const error = useRouteError();
    console.error(error);
    
    return (
        <>
            <Header customTheme={customTheme} />
            <div className={classes.container}>
            <div className={classes.oops}>УПС...</div>
            <div className={classes.er404}>404</div>
            <div className={classes.discription}>Страница не найдена</div>
        </div>
        </>
        
    )
}

export default Error404