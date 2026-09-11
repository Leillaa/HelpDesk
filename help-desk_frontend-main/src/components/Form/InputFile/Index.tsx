import React, { useEffect, useRef, useState } from "react"
import { styles } from "./styles"
import { InputFiles } from "typescript"
import { InputType } from "zlib"
import { ExecException } from "child_process"


const InputFile = ({...props}) => {
    let {
        name,
        placeholder,
        customTheme,
        ...anotherprops
    } = props

    const classes = styles(customTheme)
    const refInput = useRef<HTMLInputElement>(null)

    const onChangeFile = (e : any) : void => {
        let fileName = (e.target as HTMLInputElement).value.split(/(\\|\/)/g).pop();
        if (fileName && e)
            (e.target as HTMLInputElement).nextElementSibling!.innerHTML = 'Attached: ' + fileName;
        else (e.target as HTMLInputElement).nextElementSibling!.innerHTML = 'Choose file';

        if (anotherprops.onChange) anotherprops.onChange(e.target.value) 
        
    }

    useEffect(()=>{
        
    }, [])

    return ( 
        <div className="">
            <label className={classes.inputFile}>
                <input ref={refInput} {...anotherprops} type="file" className={classes.input} name={name} onChange={onChangeFile} placeholder={placeholder} />		
                <span id="getFileText" className={classes.span}>Выберите файл</span>
            </label>
        </div>
    )
}

export default InputFile