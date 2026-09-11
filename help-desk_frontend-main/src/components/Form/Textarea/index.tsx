import { InputHTMLAttributes } from "react";
import { styles } from "./styles";

// type ICustomInputText = InputHTMLAttributes<HTMLInputElement> | HTMLInputElement 
//                         | {
//                             customTheme: any
//                         }


const Textarea  = ({...props})=> {
    let {
        name,
        customTheme,
        ...someFields
    } = props

    const classes = styles(customTheme)

    return (
        <textarea className={classes.textarea} name={name} {...someFields}  />
    )
}

export default Textarea;