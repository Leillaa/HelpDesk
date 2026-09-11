import { InputHTMLAttributes } from "react";
import { styles } from "./styles";


const ButtonRounded = ({...props}) => {
    let {
        name,
        value,
        onSubmit,
        customTheme,
        ...someFields
    } = props

    const classes = styles(customTheme)
    
    
    return (
        <>
            <button className={classes.button}  {...someFields} onSubmit={onSubmit}>{value}</button>
        </>
    )
}

export default ButtonRounded