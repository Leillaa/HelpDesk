import { Navigate, Outlet, useOutlet } from "react-router-dom";
import { observer } from 'mobx-react-lite'

import Error404 from "../../pages/Error404";
import { useContext } from "react";
import { UserContext } from "../..";


const PublicRoute = observer(({...props}:any) => {
    const {
        customTheme
    } = props
    const user = useContext(UserContext)

    if (! user!.getIsAuth) {
        return <Outlet context = {[props]} />
    } else {
        return <Navigate to="/admin/requestlist" />;
    }
})

export default PublicRoute