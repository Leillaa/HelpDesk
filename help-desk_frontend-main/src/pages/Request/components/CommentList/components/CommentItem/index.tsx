import { useEffect, useState } from "react"
import { styles } from "./styles"
import { IComment } from "../../../../../../lib/types/interfaces";
import Gallery from "../../../../../../components/Gallery";




const CimmentItem = ({...props})=>{
    const {
        customTheme,
        colorClass
    } = props
    const [comment, setComment] = useState<IComment>();
    const classes = styles(customTheme)

    useEffect(()=>{
        let data:IComment = props.data 
        setComment(data)
        console.log(comment)
    }, [])

    return (
        <>
            <div className="">  
                <h4 className={classes.commentsH4}>{comment?.comment?.username}</h4>
                <p className={classes.p.concat(' ').concat(colorClass || '')}>{comment?.comment?.body}</p>
                { (comment?.image) ? <>
                    <div>Attached files</div>
                    <Gallery listGallery={[{image: comment?.image}]} customTheme={customTheme}/>
                </> : ''
                }
                
            </div>
        </>
    )
}

export default CimmentItem