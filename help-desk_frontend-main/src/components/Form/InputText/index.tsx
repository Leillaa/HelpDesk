import { InputHTMLAttributes } from "react";
import { styles } from "./styles";

// type ICustomInputText = InputHTMLAttributes<HTMLInputElement> | HTMLInputElement 
//                         | {
//                             customTheme: any
//                         }


const InputText  = ({...props})=> {
    let {
        name,
        onChange,
        placeholder,
        customTheme,
        small,
        ...someFields
    } = props

    console.log(someFields)

    const classes = styles(customTheme)

    return (
        <>
            <input 
                className={classes.input + ((small) ? ' ' + classes.small : '')} 
                name={name} 
                onChange={onChange} 
                type="text" 
                
                {...someFields} />
        </>
    )
}

export default InputText;