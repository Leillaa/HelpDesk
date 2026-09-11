import { InputHTMLAttributes } from "react";
import { styles } from "./styles";


const ButtonRectangle = ({...props}) => {
    let {
        value,
        onSubmit,
        customTheme,
        ...someFields
    } = props

    const classes = styles(customTheme)
    
    
    return (
        <>
            <button type="submit" className={classes.button} onSubmit={onSubmit} {...someFields}>{value}</button>
        </>
    )
}

export default ButtonRectangle