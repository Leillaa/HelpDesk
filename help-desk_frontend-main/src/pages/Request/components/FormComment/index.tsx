import { Field, Form } from "react-final-form"
import ButtonRounded from "../../../../components/ButtonRounded/ButtonRounded"
import Textarea from "../../../../components/Form/Textarea"
import { styles } from "./styles"
import { useContext, useRef, useState } from "react"
import { UserContext } from "../../../.."
import * as RequestController from '../../../../http/controllers/RequestController'
import InputFile from "../../../../components/Form/InputFile/Index"
import Validator from "../../../../lib/utils/validator"
import ModalWindow from "../../../../components/ModalWindow"


const FormComment = ({...props})=> {
    const {
        customTheme,
        idRequest,
        isRerender,
        setIsRerender
    } = props
    const classes = styles(customTheme)
    const thisForm = useRef<HTMLFormElement>(null);
    
    const user = useContext(UserContext)
    const validator = new Validator();

    const [notice, setNotice ] = useState<any>()

    




    const onsubmit = (values: any) :void =>{
        console.log(values)
        const formData = new FormData(thisForm.current as HTMLFormElement )
        formData.append('user_id', String( user?.getUserID) )

        RequestController.createComment(idRequest, formData).then((resp : any) => {
            setIsRerender(!isRerender)
        }).catch( (e: any) => {
            console.log('ERROR:', e.message)
            let modal = <ModalWindow
                            title='Error' 
                            content='Error sending message'
                            type='error'
                            isClose={true}
                            onClose={()=>setNotice(<></>)}
                            customTheme={customTheme}  
                        />
            setNotice(modal)
            // alert('Ошибка отправки сообщения')
        })

        let fileSpan = document.querySelector('input[type=file]')
        fileSpan!.nextElementSibling!.innerHTML = 'Choose file';
    }

    const validate = (values :any)=>{
        const errors : {
            content?: string,
            files?: string
        } = { }

        if (!values.content ) {
            if (!errors.content) errors.content = ''
            errors.content += 'message field cannot be empty' 
        }
        
        if (values.files ) {
            console.log(values.attachments)
            let re = /(\.jpg|\.jpeg|\.bmp|\.svg|\.png)$/i;
            if (!re.exec(values.files)) {
                errors.files = 'file extension is not supported (only images)' 
            }
        }

        return errors
    }

    return (
        <>
        {notice}
        <Form
            onSubmit={(e)=>onsubmit(e as React.FormEvent)}
            validate={(values) => validate(values)}
            render={({ handleSubmit, form}) => (
                <form ref={thisForm} onSubmit={async (event)=> {await handleSubmit(event);  form.reset()}} className={classes.form}>
                    <Field name="content">
                        {({ input, meta }) => (
                        <>
                            <label className="mb-2">New Comment:</label>
                            <div>
                                <Textarea 
                                    {...input}
                                    customTheme={customTheme} 
                                    style={{minHeight: '100px',}} 
                                    placeholder="enter your message..."></Textarea>
                                {meta.error && meta.touched && <span className={classes.exceptText}>{meta.error}</span>}
                            </div>                            
                        </>
                        )}
                    </Field>
                    <Field name="files">
                        {({ input, meta }) => (
                            <div>
                                <InputFile {...input} customTheme={customTheme} />
                                {meta.error && meta.touched && <span className={classes.exceptText}>{meta.error}</span>}
                            </div>
                        )}
                    </Field>
                    <ButtonRounded 
                        type='submit'
                        value='Send' 
                        style={{marginTop: '1rem'}}
                        customTheme={customTheme} 
                        />
                </form>
            )}
        />
        </>
    )
}



export default FormComment