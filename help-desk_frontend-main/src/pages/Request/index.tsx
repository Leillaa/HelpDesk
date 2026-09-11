import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { styles } from "./styles";
import { useContext, useEffect, useState } from "react";
import DatePrinter from "../../components/DatePrinter";
import FormComment from "./components/FormComment";
import CommentList from "./components/CommentList";
import Header from "../../components/Header";
import { CATEGORIES_REQ, IComment, IRequest, IRequestAttechment } from "../../lib/types/interfaces";

import * as RequestController from '../../http/controllers/RequestController'
import Gallery from "../../components/Gallery";
import { PATHS } from "../../lib/constants/routes";
import { UserContext } from "../..";
import ModalWindow from "../../components/ModalWindow";
import RightInfo from "./components/RightInfo";



const Request = ({...props}) => {
    const [outletContext] = useOutletContext() as Array<any>;

    const {
        customTheme
    } = outletContext
    const classes = styles(customTheme)
    const { id } = useParams(); 
    const navigate = useNavigate();
    const user = useContext(UserContext)

    const [request, setRequest] = useState<IRequest>({})
    const [commentList, setCommentList] = useState<Array<IComment>>([])
    const [attachments, setAttachments] = useState<Array<IRequestAttechment>>([])
    const [isRerender, setIsRerender] = useState<boolean>(false)
    const [notice, setNotice] = useState<any>()
    
    // Массив для окараски страницы в соответствующие стили в зависимости от пердаваемого значения
    const priorities = ['noUrgently', 'done', 'urgently']
    const priorityTypes: any = {}
    priorities.forEach(function(el, i) {
        priorityTypes[(CATEGORIES_REQ[i as never] as any).type] = el
    });

    let colorClass =  classes[priorityTypes[request.groups as string] as never]

    useEffect(()=>{
        //Запрос к БД
        console.log('Request component - useEffect called with id:', id);
        if (id)
            RequestController.getOneById(parseInt(id as string)).then((resp :any)=>{
                console.log('Request component - API response:', resp);
                if (resp?.application) setRequest(resp?.application);
                if (resp?.attachment) setAttachments(resp?.attachment)

                let newFormatComment = resp?.comment.map((comment :any) => {return {comment: comment}})
                let attechmentcomment = [...newFormatComment, ...resp?.attachment_comment]
                    .map((comment : IComment) => {
                        comment.comment!.created = new Date(comment.comment?.created as string)
                        return comment
                    }).sort((a:IComment, b:IComment)=> ((a.comment?.created as Date ) > (b.comment?.created as Date)) ? 1 : -1)
                if (attechmentcomment) setCommentList(attechmentcomment)

                colorClass =  classes[priorityTypes[request.groups as string] as never]
            }).catch((e :any)=>{
                console.log('ERROR: ', e, '--Error loading request body')
                if (e.response?.status == 403) {
                    let modal = <ModalWindow
                                    title='Error' 
                                    content='Authorization error'
                                    type='error'
                                    // isClose={true}
                                    onClose={()=>{
                                        user?.logout()
                                        navigate(PATHS.LOGIN)
                                        // setNotice(<></>)
                                    }}
                                    customTheme={customTheme}  
                                />
                    setNotice(modal)
                    // alert('Ошибка авторизации')
                    
                } else if (e.response?.status == 500) {
                    let modal = <ModalWindow
                                    title='Error' 
                                    content='Sorry, this action is temporarily unavailable'
                                    type='error'
                                    isClose={true}
                                    onClose={()=>setNotice(<></>)}
                                    customTheme={customTheme}  
                                />
                    setNotice(modal)
                    // alert('Простите, данное действие временно не доступно')
                } else {
                    let modal = <ModalWindow
                                    title='Error' 
                                    content='Unexpected error, data may be displayed partially. Please report this to support'
                                    type='error'
                                    isClose={true}
                                    onClose={()=>setNotice(<></>)}
                                    customTheme={customTheme}  
                                />
                    setNotice(modal)
                    // alert('Непредвиденная ошибка, данные могут отображаться частично. Пожалуйста, сообщите об этом в поддержку')
                    console.log('ERROR: mismatch of data formats between server and client')
                }
            })
        else console.log('question not found')
    }, [])

    
    useEffect(()=>{
        if (id){
            RequestController.getOneById(parseInt(id as string)).then((resp :any)=>{
                if (resp?.application) setRequest(resp?.application);
                if (resp?.attachment) setAttachments(resp?.attachment)

                let newFormatComment = resp?.comment.map((comment :any) => {return {comment: comment}})
                let attechmentcomment = [...newFormatComment, ...resp?.attachment_comment]
                    .map((comment : IComment) => {
                        comment.comment!.created = new Date(comment.comment?.created as string)
                        return comment
                    }).sort((a:IComment, b:IComment)=> ((a.comment?.created as Date ) > (b.comment?.created as Date)) ? -1 : 1)
                if (attechmentcomment) setCommentList(attechmentcomment)

                colorClass =  classes[priorityTypes[request.groups as string] as never]


            }).catch((e :any)=>{
                console.log('ERROR: ', e, '--Error loading request body')

                if (e.response?.status == 403) {

                    alert('Authorization error')
                    user?.logout()
                    navigate(PATHS.LOGIN)
                } else if (e.response?.status == 500) {
                    alert('Sorry, this action is temporarily unavailable')
                } else {
                    alert('Unexpected error, data may be displayed partially. Please report this to support')
                    console.log('ERROR: mismatch of data formats between server and client')
                }
            })}
        else console.log('question not found')
    }, [isRerender])


    return (<> 
        {(request.id) ? <>
            {notice}
            <Header customTheme={customTheme} />
            <div className={classes.page} >
                <div className={classes.content}> 
                    <h2>Request №{request.id}</h2>
                    <div className="">
                        <h4 className={classes.h4}>Theme:</h4>
                        <p className={classes.p.concat(' ').concat(colorClass || '')}>{(request.team) ? request.team : ''}</p>
                    </div>
                    
                    <div className="">
                        <h4 className={classes.h4}>Problem:</h4>
                        <p className={classes.p.concat(' ').concat(colorClass || '')}>{(request.text)  ? request.text : ''}</p>
                    </div>
                    <div className="">
                        <Gallery listGallery={attachments} customTheme={customTheme}/>
                    </div>

                    <h4 className="mt-5 mb-5">Comments:</h4>
                    
                    <FormComment idRequest={id} isRerender={isRerender} setIsRerender={setIsRerender} customTheme={customTheme}/>

                    <CommentList 
                        commentList={commentList} 
                        colorClass={colorClass}/>
                    
                </div>
                <RightInfo
                    customTheme = {customTheme}
                    colorClass = {colorClass}
                    request = {request}
                    commentCount = {commentList.length}
                />

            </div>
        </> : <>
            <Header customTheme={customTheme} />
            <div className={classes.page}>
                <div className={classes.content}>
                    <h2>Loading request...</h2>
                    <p>Please wait</p>
                </div>
            </div>
        </>}
    </>)
}

export default Request