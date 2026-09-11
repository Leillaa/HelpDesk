import { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { styles, stylesTabs } from "./styles";
import ButtonRectangle from "../../components/ButtonRectangle/ButtonRectangle";
import RequestItem from "./components/RequestItem";
import RequestColumn from "./components/RequestColumn";
import Header from "../../components/Header";

import { CATEGORIES_REQ, IRequest } from "../../lib/types/interfaces";

import * as RequestController from '../../http/controllers/RequestController'
import { UserContext } from "../..";
import { PATHS } from "../../lib/constants/routes";
import ModalWindow from "../../components/ModalWindow";


interface IListRequests {
    noUrgently: IRequest[], 
    done: IRequest[], 
    urgently: IRequest[]
}


const RequestList = ({...props}) => {
    const [outletContext] = useOutletContext() as Array<any>;
    
    const {
        customTheme
    } = outletContext
    const classes = styles(customTheme)
    const classesTabs = stylesTabs;
    const user = useContext(UserContext)
    const [notice, setNotice]  = useState<any>()

    const navigate = useNavigate();
    

    const [listRequests, setListRequests] = useState<IListRequests>({noUrgently: [], done: [], urgently: []});
    const [tabSettings, setTabSettings] = useState({
        on: false,
        noUrgently: true, 
        done: true, 
        urgently: true,
    });

    useEffect(()=>{
        // Опредение размера экрана для отображения вкладок
        tabSettings.on = document.body.clientWidth <= 800
        if (tabSettings.on) {
            tabSettings.noUrgently = true
            tabSettings.urgently = false
            tabSettings.done = false

        }
        setTabSettings(Object.assign({}, tabSettings))

        // зАПРОС К бд (если мобильная версия - запрашиваем только нужную колонку, если компьютерная - все)
        
        RequestController.getAllByUserId( user?.getUserID as number ) 
            .then((resp : any)=>{
                if (resp) {
                    if ((resp as Array<IRequest>).length) {
                        let newList : IListRequests = {noUrgently: [], done: [], urgently: []}
                        resp.forEach((requestItem :IRequest) => {
                            if (requestItem!.groups == CATEGORIES_REQ[0].type) newList.noUrgently.push(requestItem)
                            else if (requestItem!.groups == CATEGORIES_REQ[1].type) newList.done.push(requestItem)
                            else if (requestItem!.groups == CATEGORIES_REQ[2].type) newList.urgently.push(requestItem)
                            else {console.log('Unknown type of object:'); console.log(requestItem)}
                        });
                        setListRequests(newList);
                    }
                    
                }

            }).catch((e: any)=>{
                console.log('ERROR: ', e, '--error loading list of questions')
                if (e.response.status == 403) {
                    let modal = <ModalWindow
                                    title='Error' 
                                    content='Authorization error'
                                    type='error'
                                    isClose={true}
                                    onClose={()=>{
                                        user?.logout()
                                        navigate(PATHS.LOGIN)
                                        // setNotice(<></>)
                                    }}
                                    customTheme={customTheme}  
                                />
                    setNotice(modal)
                    // alert('Ошибка авторизации')
                    
                }
                if (e.response.status == 500) {
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
                }
            })

    }, [])

    const onTabChecked = (e:React.FormEvent<any>)=> {
        if ((e.target as HTMLInputElement).checked) {
            let tabId = (e.target as HTMLInputElement).id;
            if (tabId) {
                switch (tabId) {
                    case 'tab-no-urgently' :
                        if (tabSettings.on) {
                            tabSettings.noUrgently = true
                            tabSettings.urgently = false
                            tabSettings.done = false
                        }
                        break
                    case 'tab-done' :
                        if (tabSettings.on) {
                            tabSettings.noUrgently = false
                            tabSettings.urgently = false
                            tabSettings.done = true
                        }
                        break
                    case 'tab-urgently' :
                        if (tabSettings.on) {
                            tabSettings.noUrgently = false
                            tabSettings.urgently = true
                            tabSettings.done = false
                        }
                        break
                } 
                setTabSettings(Object.assign({}, tabSettings))
            }
        } 
    }
    
    return (
        <>
        {notice}
        <Header customTheme={customTheme} />
        <div className="request__list__page"> 
            <nav className={classes.pageNav}>
                <h2>Request list:</h2>
                <ButtonRectangle value="+ New request" customTheme={customTheme} style={{padding: '.5rem 2rem'}} onClick={()=>navigate('/admin/newrequest')}/>
            </nav>
            <div className={classes.list} > 
                {
                    (tabSettings.on) ? 
                    <>
                        <input className={classes.tabInput} onChange={(ev)=>onTabChecked(ev)} id="tab-no-urgently" name="tab-btn" type="radio" value="" />
                        <label className={classes.tabLabel} htmlFor="tab-no-urgently">{CATEGORIES_REQ[0].name}</label>
                        <input className={classes.tabInput} onChange={(ev)=>onTabChecked(ev)} id="tab-done" name="tab-btn" type="radio" value="" />
                        <label className={classes.tabLabel} htmlFor="tab-done">{CATEGORIES_REQ[1].name}</label> 
                        <input className={classes.tabInput} onChange={(ev)=>onTabChecked(ev)} id="tab-urgently" name="tab-btn" type="radio" value="" />
                        <label className={classes.tabLabel} htmlFor="tab-urgently">{CATEGORIES_REQ[2].name}</label>
                    </> : <></>
                }
                { 
                    (tabSettings.on) ? <> 
                        {
                            (tabSettings.noUrgently) ? <RequestColumn customTheme={customTheme} listRequests={listRequests.noUrgently} type='noUrgently' isShow={tabSettings.noUrgently}/> : ''
                        }
                        {
                            (tabSettings.done) ? <RequestColumn customTheme={customTheme} listRequests={listRequests.done} type='done' isShow={tabSettings.done}/> : ''
                        }
                        {
                            (tabSettings.urgently) ? <RequestColumn customTheme={customTheme} listRequests={listRequests.urgently} type='urgently' isShow={tabSettings.urgently}/> : ''
                        }

                    </>
                    :  <> 
                        <RequestColumn customTheme={customTheme} listRequests={listRequests.noUrgently} type='noUrgently' isShow={tabSettings.noUrgently}/>
                        <RequestColumn customTheme={customTheme} listRequests={listRequests.done} type='done' isShow={tabSettings.done}/>
                        <RequestColumn customTheme={customTheme} listRequests={listRequests.urgently} type='urgently' isShow={tabSettings.urgently}/>
                    </>
                }
            </div>
        </div>
        </>
    )
}

export default RequestList