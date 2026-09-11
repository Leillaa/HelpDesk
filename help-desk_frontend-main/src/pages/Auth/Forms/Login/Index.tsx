import { useNavigate } from "react-router-dom";
import { styles } from "../../styles";
import { useContext, useState } from "react";
import InputText from "../../../../components/Form/InputText";
import { Field, Form } from "react-final-form";
import { UserContext } from "../../../..";

// import * as UserController from '/src/http/controllers/UserController'
import * as UserController from '../../../../http/controllers/UserController'
import { ExecException } from "child_process";
import Validator from "../../../../lib/utils/validator";
import { PATHS } from "../../../../lib/constants/routes";
import { jwtDecode } from "jwt-decode";
import { roles } from "../../../../lib/constants/roles";
import ModalWindow from "../../../../components/ModalWindow";

const Login = ({...props}) => {

    const {
        customTheme
    } = props
    const classes = styles(customTheme)
    const user = useContext(UserContext)

    const navigate = useNavigate();
    const validator = new Validator();
    const [notice, setNotice] = useState<any>()

    const onsubmit = (values: any) :void =>{
        UserController.authorization(values).then((data : any) => {
            user?.setUser({
                user_id : data.user_id,
                role: roles.User
            })
            user?.setIsAuth(true)
            navigate(PATHS.REQUESTLIST)
        }).catch( (e: any) => {
            console.log('ERROR:', e.message)
            let modal = <ModalWindow 
                            title='Error' 
                            content='Invalid username or password'
                            type='error'
                            isClose={true}
                            onClose={()=>setNotice(<></>)}
                            customTheme={customTheme}  
                        />
            setNotice(modal)
        })
         
        
        
    }
    const validate = (values :any)=>{
        const errors : {
            username?: string,
            password?: string
        } = {}
        console.log(values)
        if (!values.username ) {
            errors.username = 'username cannot be empty'
        } else if (validator.hasForbiddenLetters(values.username)) {
            errors.username = 'username contains forbidden symbols. Allowed: _,-,%,a-z,A-z,0-9'
        }

        if (!values.password ) {
            if (!errors.password) errors.password = ''
            errors.password = 'password cannot be empty'
        } else if (validator.hasForbiddenLetters(values.password)) {
            if (!errors.password) errors.password = ''
            errors.password = 'password contains forbidden symbols. Allowed: _,-,%,a-z,A-z,0-9'
        }

        return errors
    }


    return (
        <>
        {notice}
        <Form
            onSubmit={(e)=>onsubmit(e as React.FormEvent)}
            validate={(values) => validate(values)}
            render={({ handleSubmit }) => (
            
                <form onSubmit={handleSubmit} className={classes.regLogForm}> 
                    <h2 className={classes.regLogFormH2}>Войдите в свой аккаунт</h2>
                    
                    <div className={classes.regLogFormElements}>
                    <Field name="username">
                        {({ input, meta }) => (
                        <>
                            <label className={classes.regLogFormElementsLabel}>Логин</label>
                            <div>
                                <InputText {...input}  type="text" customTheme={customTheme}/>
                                {meta.error && meta.touched && <span className={classes.exceptText}>{meta.error}</span>}
                            </div>
                            
                        </>
                        )}
                    </Field>
                        
                    <Field name="password">
                        {({ input, meta }) => (
                        <>
                            <label className={classes.regLogFormElementsLabel} >Пароль</label>
                            <div>
                                <InputText {...input} type="password" customTheme={customTheme}/>
                                {meta.error && meta.touched && <span className={classes.exceptText}>{meta.error}</span>}
                                {console.log(meta)}
                            </div>
                        </>
                        )}
                    </Field>
                        
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className={classes.regLogFormButton}>Вход</button>
                    </div>
                    
                </form>
            )}
        />
        </>
    )
}

export default Login