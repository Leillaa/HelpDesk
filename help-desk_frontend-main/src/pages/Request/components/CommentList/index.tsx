import { useEffect, useState } from "react"
import { IComment } from "../../../../lib/types/interfaces"
import { styles } from "./styles"
import CimmentItem from "./components/CommentItem"

import * as RequestController from '../../../../http/controllers/RequestController'

// const testComment:IComment[] = [
//     {
//         id:1,
//         sender: 'Savinov BM',
//         content: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus corporis, minima at necessitatibus, dolore possimus adipisci, et voluptatibus hic ipsum molestias. Aperiam quod placeat laborum architecto earum. Dolore, sint repudiandae? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga similique quae quos, obcaecati ipsum molestias id eveniet sit odit sed ab tempore neque nam minima consequuntur iure ad labore ipsa?'
//     },
//     {
//         id:2,
//         sender: 'Savinov BM',
//         content: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.'
//     }
// ]

const CommentList = ({...props})=>{
    const {
        commentList,
        // idRequest,
        customTheme,
        colorClass
    } = props
    const classes = styles(customTheme)
    // const [commentList, setCommentList] = useState<IComment[]>([])

    // useEffect(()=>{
    //     // Запрос к бд

    //     RequestController.getCommentsById(idRequest).then((resp :Array<IComment>)=>{
    //             setCommentList(resp)

    //     }).catch((e :any) => {
    //         console.log('ERROR: ' + e + ' --Ошибка загрузки коментариев')
    //         alert('Не удалось загрузить коментарии')
    //     }) 


    // }, [])
    return (
        <div className="request__comments">
            {
                (!commentList) ? ''
                : commentList.map((comment : IComment) => <CimmentItem 
                    key={comment.comment?.id}
                    customTheme={customTheme}
                    data={comment}
                    colorClass={colorClass}/>)
            }
        </div>
    )
}


export default CommentList