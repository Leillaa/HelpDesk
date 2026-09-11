import { useEffect, useLayoutEffect, useState } from "react"
import { styles } from "./styles"
import { IComment } from "../../../../lib/types/interfaces";
import Gallery from "../../../../components/Gallery";
import DatePrinter from "../../../../components/DatePrinter";
import ButtonRounded from "../../../../components/ButtonRounded/ButtonRounded";
import ButtonRectangle from "../../../../components/ButtonRectangle/ButtonRectangle";
import ModalWindow from "../../../../components/ModalWindow";

import * as RequestController from '../../../../http/controllers/RequestController'



const RightInfo = ({...props})=>{
    const {
        customTheme,
        colorClass,
        request,
        commentCount
    } = props
    const classes = styles(customTheme)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [notice, setNotice] = useState<any>()
    const buttonStyles = {
        width: '100%',
    }

    useLayoutEffect(()=>{
        setIsActive(request.status == 'Active')
    }, [])

    const onCloseRequest = ()=>{
        let modal = <ModalWindow
                        title='Warning' 
                        content='Are you sure you want to close the request?'
                        type=''
                        isClose={true}
                        onClose={()=>setNotice(<></>)}
                        action={closeRequest}
                        actionName='Close request'
                        customTheme={customTheme}  
                    />
        setNotice(modal)
    }
    const closeRequest = () => {
       alert('Sending request to server')
        RequestController.closeRequest(request.id).then(()=>{
            let modal = <ModalWindow
                      title='Success!'
                      content='The request has been closed'
                      type='ok'
                      isClose={true}
                      onClose={()=>setNotice(<></>)}
                      customTheme={customTheme}
                   />
            setNotice(modal)
        })

    }

    return (
        <>
            { notice }
            <div className={classes.aboutRequest.concat(' ').concat(colorClass || '')}>
                <div className={classes.aboutRequestDiv}>
                    <div className={classes.aboutRequestDivDiv}>From:</div>
                    {request.name}
                </div>
                <div className={classes.aboutRequestDiv}>
                    <div className={classes.aboutRequestDivDiv}>Opened:</div>
                    <DatePrinter date={new Date(request.created as string)} format='dd.mm.yy HH:MM:SS' />
                </div>
                <div className={classes.aboutRequestDiv}>
                    <div className={classes.aboutRequestDivDiv}>Status:</div>
                    {request.status}
                </div>
                <div className={classes.aboutRequestDiv}>
                    <div className={classes.aboutRequestDivDiv}>Comments:</div>
                    {commentCount} 
                </div>
                {request.status}
                {
                    (isActive) ? <>
                        <div>
                            <ButtonRectangle onClick={onCloseRequest} value='Close request' style={buttonStyles} />
                        </div>
                    </>
                    : <></>
                }

            </div>
        </>
    )
}

export default RightInfo