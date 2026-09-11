
import { createBrowserRouter } from 'react-router-dom'
// import Index from '../../pages/Index';
import { routes } from '../../lib/constants/routes';




const AppRouter = () => {
    const router = createBrowserRouter(routes as any)
    return router
}

export default AppRouter;