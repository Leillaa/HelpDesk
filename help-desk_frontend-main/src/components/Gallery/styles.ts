import { createUseStyles } from "react-jss";
import { ICustomThemeParams } from "../../lib/types/styles";


export const styles = createUseStyles({
    container: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '20px'
        
    }
})