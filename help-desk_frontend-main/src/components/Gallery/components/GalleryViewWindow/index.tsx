import Carousel from "react-bootstrap/Carousel"
import { styles } from "./styles"
import { IGaleryImage } from "../../../../lib/types/interfaces"
import { useState } from "react"


const GalleryViewWindow = ({...props})=> {
    let {
        customTheme,
        listGallery,
        activeItem,
        setActiveItem
    } = props
    const [index, setIndex] = useState(activeItem-1);

    const handleSelect = (selectedIndex : number) => {
        setIndex(selectedIndex);
    };
    const classes = styles(customTheme)

    const closeWindow = (e : any)=> {
        if (e.target == e.currentTarget) setActiveItem(0)
    }
    const closeWindowX = (e : any)=>  setActiveItem(0)
    
    const alistGallery = (listGallery as Array<any>).map((el) => {
        const src = el.image_url || (el.image ? ((el.image.indexOf('http') === 0) ? el.image : `${process.env.REACT_APP_API_URL}${el.image}`) : '')
        let img = new Image()
        img.src = src
        const styles : {
            width? : string,
            height? : string
        } = {}

        const wW = window.innerWidth  * 0.8 - 40
        const hW = window.innerHeight * 0.8 - 40

        if (wW/hW > 1 ) { //горизонт 
            if (img.width / img.height > 1) {
                if (wW/hW < img.width / img.height) styles.width = (wW ) + 'px'
                else  styles.height = (hW ) + 'px'
            } else styles.height = hW + 'px'
        } else { //вертикаль
            if (img.height / img.width > 1) { // вертикальная картинка
                if ( hW / wW  < img.height / img.width ) styles.height = (hW ) + 'px'
                else styles.width = (wW ) + 'px'
            } else { // горизонтальная картинка
                styles.width = wW + 'px'
            }
        }

        return {
            current: el,
            styles,
            src
        }
    })
    
    return(<>
        <div className={classes.background} onClick={closeWindow} >
            <div className={classes.container}>
                <span className={classes.close} onClick={closeWindowX}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill={customTheme?.colorBlue} className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                </span>
                
                <Carousel activeIndex={index} onSelect={handleSelect} slide={false} fade>
                    {
                        alistGallery.map((image:{current: IGaleryImage, styles: any, src: string})=>
                                <Carousel.Item>
                                
                                    <img className={classes.image} src={image.src} style={image.styles}></img>
                                </Carousel.Item>
                        )
                    }
                </Carousel>
            </div>
        </div>
    </>)
}

export default GalleryViewWindow