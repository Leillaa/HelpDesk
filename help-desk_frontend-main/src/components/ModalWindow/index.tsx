import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { styles } from './styles';
import ButtonRounded from '../ButtonRounded/ButtonRounded';

const ModalWindow = ({...props}) => {

  const {
    title,
    content,
    isClose,
    onClose,
    action,
    actionName,
    type, // error ok notice
    customTheme
  } = props
  const classes = styles(customTheme)
  const [isShow, setIsShow] = useState<boolean>(true)
  
  const [color, setColor] = useState<string>('')
  
  useEffect (()=>{
    if (type == 'ok') setColor(classes.ok)
    if (type == 'error') setColor(classes.error)
  }, [])
  
  const closeWindow = (e : any) => {
    setIsShow(! isShow)
    if (onClose) onClose()
  }

  return (
    <>
      {(isShow) ?
        <div className={classes.background} onClick={(isClose) ? closeWindow : ()=>{}} >
            <div className={classes.container.concat(' ').concat(color)
              }>
              { (isClose) ?
                <span className={classes.close} onClick={closeWindow}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill={customTheme?.colorBlue} className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                </span>
              : ''
              }
              {
                (title) 
                ? <div className={classes.title}>{title}</div>
                : ''
              }
              {
                (content) 
                ? <div className={classes.content}>{content}</div>
                : ''
              }
              {
                (action) 
                ? <button className={classes.button} onClick={async(e) => {await action(e); closeWindow(e)}} type='button' >{actionName}</button>
                : ''
              }
            </div>
        </div>
      : ''}
    </>
  );
}

export default ModalWindow;