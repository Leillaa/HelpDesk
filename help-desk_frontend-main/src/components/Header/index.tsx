
import { observer } from 'mobx-react-lite'
import {user} from '../../store' 
import Authorized from './Authorized'
import Guest from './Guest'
import { useContext } from 'react'
import { UserContext } from '../..'
import { PATHS } from '../../lib/constants/routes'


const Header = observer(({...props}:any) => {

    const {
        customTheme,
    } = props
    const user = useContext(UserContext)

    return (
        <>
        
        {
            (user!.getIsAuth) ? <Authorized customTheme={customTheme}/>
                : (window.location.pathname != PATHS.LOGIN && window.location.pathname != PATHS.REGISTRATION) ? 
                <Guest customTheme={customTheme}/>
                : ''
        }
        
        </>
    )
})

export default Header