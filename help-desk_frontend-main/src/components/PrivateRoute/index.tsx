import { Navigate, Outlet, useOutlet } from "react-router-dom";
import { observer } from 'mobx-react-lite'

import Error404 from "../../pages/Error404";
import { useContext } from "react";
import { UserContext } from "../..";


const PrivateRoute = observer(({...props}:any) => {
    const {
        customTheme,
        roles
    } = props
    const user = useContext(UserContext)

    console.log('PrivateRoute - isAuth:', user!.getIsAuth);
    console.log('PrivateRoute - role:', user!.getRole);

    // Простая проверка роли - если пользователь авторизован, разрешаем доступ
    if (user!.getIsAuth) {
        return <Outlet context = {[props]} />
    } else {
        return <Navigate to="/login" />;
    }
})

export default PrivateRoute