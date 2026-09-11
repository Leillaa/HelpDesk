import { useState } from "react"
import Login from "./Forms/Login/Index";
import Regisration from "./Forms/Registration/Index";
import { useNavigate } from "react-router-dom";
import { styles } from "./styles";
import OnAuth from "../../components/Header/OnAuth";
import Header from "../../components/Header";

const Auth = ({...props}) => {

    const {
        customTheme,
        isLog
    } = props
    const classes = styles(customTheme)

    const [enterType, setEnterType] = useState(isLog);
    const navigate = useNavigate();



    return (
        <>
            {/* <Header customTheme={customTheme} /> */}
            <OnAuth toReg={enterType} onclickEvent={()=>setEnterType( !enterType)} customTheme={customTheme}/>
            <div className={classes.regLogPage}> 
                {
                    (enterType) ? <Login customTheme={customTheme}/> : <Regisration customTheme={customTheme} />
                }
                <div className={classes.regLogImage}></div>

            </div>
        </>
    )
}

export default Auth