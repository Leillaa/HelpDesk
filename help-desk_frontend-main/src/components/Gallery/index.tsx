import { useState } from "react"
import { IGaleryImage } from "../../lib/types/interfaces"
import GalleryViewWindow from "./components/GalleryViewWindow"
import ItemSmall from "./components/ItemSmall/Index"
import { styles } from "./styles"





const Gallery = ({...props})=> {

    const {
        listGallery, 
        customTheme
    } = props

    const [activeItem, setActiveItem] = useState(0)
    const classes = styles(customTheme)

    

    return(
        <>
            <div className={classes.container}>
                {listGallery.map((image :IGaleryImage, i:number) => 
                    <ItemSmall 
                        setActiveItem={setActiveItem} 
                        index={i+1}
                        image={image} 
                        customTheme={customTheme} />)}

            </div>
            {
                (activeItem) ?  <GalleryViewWindow activeItem={activeItem} listGallery={listGallery} setActiveItem={setActiveItem} customTheme={customTheme}/>
                : ''
            }
            
        </>
    )

}


export default Gallery