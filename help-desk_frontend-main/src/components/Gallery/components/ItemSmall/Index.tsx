import { styles } from "./styles"

const ItemSmall = ({...props})=> {

    const {
        customTheme,
        image,
        setActiveItem,
        index
    } = props

    const classes = styles(customTheme)

    const src = image?.image_url || (image?.image ? ((image.image.indexOf('http') === 0) ? image.image : `${process.env.REACT_APP_API_URL}${image.image}`) : '')

    return (
        <div
            onClick={()=>setActiveItem(index)}
            className={classes.image}
            style={{backgroundImage: `url(${src})`}}></div>
    )
}

export default ItemSmall