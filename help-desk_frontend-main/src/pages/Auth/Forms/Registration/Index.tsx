import { useContext, useState } from "react";
import { styles } from "../../styles";
import { useNavigate } from "react-router-dom";
import InputText from "../../../../components/Form/InputText";
import { Field, Form } from "react-final-form";
import { UserContext } from "../../../..";
import * as UserController from '../../../../http/controllers/UserController'
import Validator from "../../../../lib/utils/validator";
import { PATHS } from "../../../../lib/constants/routes";
import { roles } from "../../../../lib/constants/roles";
import ModalWindow from "../../../../components/ModalWindow";



const Regisration = ({...props}) => {

    const {
        customTheme
    } = props
    const classes = styles(customTheme)
    const user = useContext(UserContext)

    const validator = new Validator();

    const navigate = useNavigate();
    const [notice, setNotice] = useState<any>()
    const onsubmit = (values: any) :void =>{
        UserController.registration(values).then((data : any) => {
            user?.setUser({
                user_id : data.user_id,
                role: roles.User
            })
            user?.setIsAuth(true)
            navigate(PATHS.REQUESTLIST)
        }).catch( (e: any) => {
            console.log('ERROR:', e.message)
            if (e.response?.status == 500) {
                let modal = <ModalWindow
                            title='Error' 
                            content='User with such username already exists'
                            type='error'
                            isClose={true}
                            onClose={()=>setNotice(<></>)}
                            customTheme={customTheme}  
                        />
                setNotice(modal)
            } else {
                let modal = <ModalWindow 
                            title='Error' 
                            content='Sorry, this action is temporarily unavailable'
                            type='error'
                            isClose={true}
                            onClose={()=>setNotice(<></>)}
                            customTheme={customTheme}  
                        />
                setNotice(modal)
            }
        })
         
        
        
    }

    const validate = (values :any)=>{
        const errors : {
            username?: string,
            email?: string,
            password?: string
        } = {}

        if (!values.username ) {
            if (!errors.username) errors.username = ''
            errors.username += 'username cannot be empty' 
        } else if (validator.hasForbiddenLetters(values.username)) {
            if (!errors.username) errors.username = ''
            errors.username = 'username contains forbidden symbols. Allowed: _,-,%,a-z,A-z,0-9'
        }

        if (!values.email ) {
            errors.email = 'email cannot be empty'
        } else {
            let email = String(values.email).toLowerCase()
            const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if ( ! email.match(re)) errors.email = 'please enter a valid email address'
        }
        
        if (!values.password ) {
            if (!errors.password) errors.password = ''
            errors.password = 'password cannot be empty'
        } else if (validator.hasForbiddenLetters(values.password)) {
            if (!errors.password) errors.password = ''
            errors.password = 'password contains forbidden symbols. Allowed: _,-,%,a-z,A-z'
        }
        console.log(errors)
        return errors
    }


    return (
        <>
        {notice}
        <Form
            onSubmit={(e)=>onsubmit(e as any)}
            validate={(values) => validate(values)}
            render={({ handleSubmit }) => (
                <form onSubmit = { handleSubmit } className={classes.regLogForm.concat(' ').concat(classes.regisration) } > 
                    <h2 className={classes.regLogFormH2}>Регистрация</h2>
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
                        <Field name="email">
                            {({ input, meta }) => (
                            <>
                                <label className={classes.regLogFormElementsLabel}>Почта</label>
                                <div>
                                    <InputText {...input}  type="email" customTheme={customTheme}/>
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
                        <button type="submit" className={classes.regLogFormButton}>Регистрация</button>
                    </div>
                    
                </form>
            )}
        />
        </>
    )
}

export default Regisration;