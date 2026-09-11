import { makeAutoObservable } from "mobx"
import { roles } from "../lib/constants/roles"
import { useNavigate } from "react-router-dom"

const enum ROLE {
    ADMIN = 1,
    USER
}

class User {
    private isAuth: boolean = false
    isAuthProcess: boolean = false
    userID: number  = 1
    userName: string | null | undefined = ''
    email: string | null | undefined = ''
    role:string | null | undefined = roles.Admin


    constructor() {
        makeAutoObservable(this);
    }
    get getUserID() {
        return this.userID
    }

    get getIsAuth() {
        return this.isAuth
    }
    
    get getIsAuthProcess() {
        return this.isAuthProcess
    }

    get getRole() {
        return this.role
    }

    setIsAuth(isAuth:boolean) {
        this.isAuth = isAuth
    }


    async login(userName:string, email:string, id:number ) {
        this.userName = userName
        this.email = email
        this.userID = id
    }

    logout(){
        this.userName = ''
        this.email = ''
        this.isAuth = false  
        this.userID = 0

        localStorage.removeItem('token')
        console.log('User logged out, token removed');
    }

    // async checkAuth() {
    //     // this.isAuth = true;
    //     try {
    //     //   const resp = await AuthService.refresh();
    //     //   localStorage.setItem("token", resp.data.accessToken);
    //       this.isAuth = true;
    
    //      } catch (err) {
    //     //   console.log("login error");
    //      } finally {
    //       this.isAuth = false;
    //     } 
    //   }
    
    public setUser = (user: {
        userName?: string,
        email?: string,
        role?: string,
        user_id?: number
    }) => {
        this.userID = this.userID
        this.userName = user.userName
        this.email = user.email
        this.role = user.role

        // this.setIsAuth(true)
    }
}

export default  User
// export default User
