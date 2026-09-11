import { IRequest } from "../../../../lib/types/interfaces"
import RequestItem from "../RequestItem"
import { styles } from "./style"


const RequestColumn = ({...props})=> {
    const {
        customTheme,
        listRequests,
        type, // noUrgently, urgently, done
        isShow
    } = props
    const classes = styles(customTheme)


    return (
        <>
            <div  className={classes.listDiv}  id="content-no-urgently">
                    {(!listRequests) ? ''
                        : listRequests.map((item:IRequest)=>
                           <RequestItem key={item.id} type={type} customTheme={customTheme} data={item}/>
                        ) }
                </div>
        </>
    )
}

export default RequestColumn