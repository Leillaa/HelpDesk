import { useNavigate } from "react-router-dom";
import { styles } from "./styles";
import { ICustomThemeParams } from "../../../../lib/types/styles";
import DatePrinter from "../../../../components/DatePrinter";
import { IRequest } from "../../../../lib/types/interfaces";
import IconNew from "../../../../components/IconNew";


type IRequestItem = {
    data: IRequest, 
    // {
    //     id: Number,
    //     topic: String,
    //     sender: String,
    //     date: Date,
    // },
    customTheme: ICustomThemeParams,
    type: String
}

const RequestItem = ({ ...props}:IRequestItem) => {
    const {
        customTheme,
        type,
        data 
    } = props
    const classes = styles(customTheme)
    // console.log(customTheme)

    const navigate = useNavigate();

    return (
        <div className={classes.requestItem.concat(' ')
            .concat( (
                type == 'noUrgently' ? classes.noUrgently : 
                (type == 'urgently') ? classes.urgently : 
                (type == 'done') ? classes.done : ''))} onClick={()=>navigate('/admin/requestlist/request/' + data.id)}> 
            <div className={classes.requestItemDiv}>
                {'Request №' + data.id}
                {data.comment_count === 0 && <span style={{color: 'red', backgroundColor: 'red', display: 'inline-block', borderRadius: '50%', width: '10px', height: '10px', marginLeft: '330px'}} />}
            </div>
            {/* {(data.status == 'Active') ? <IconNew customTheme={customTheme}/> : ''} */}
            <hr className={classes.itemHr} />
            <div className={classes.requestItemDiv}>From: {(data.name) ? data.name : 'Sender not defined'}</div>
            <div className={classes.requestItemDiv}>Date: <DatePrinter date = {new Date(data.created as string)} format = {'dd.mm.yyyy hh:tt'} /> </div>
        </div>
    )
}


export default RequestItem