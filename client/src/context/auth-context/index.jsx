
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { loginService, registerService } from "@/services";


import { createContext, useState } from "react";


export const AuthContext = createContext(null)

export default function AuthProvider({children}){
    const[signInFormData,setSignInFormData] = useState(initialSignInFormData)
    const[signUpFormData,setSignUpFormData] = useState(initialSignUpFormData)
    const [auth,setAuth]= useState({
        authenticate:false,
        user:null
    })
    
    async function handleRegisterUser(event) {
        event.preventDefault()
        const data = await registerService(signUpFormData);

        console.log(data);
        
    }
    async function handleLoginUser(event) {
        event.preventDefault()
        const data = await loginService(signInFormData);

        console.log(data);
        if(data.success){
            console.log(data);
            
            sessionStorage.setItem('accessToken',JSON.stringify(data.data.accessToken))
            setAuth({
                authenticate:true,
                user:data.data.user
            })
        }
    }
    return (
    <AuthContext.Provider value={{
        signInFormData,setSignInFormData,
        signUpFormData,setSignUpFormData,
        handleRegisterUser,handleLoginUser
    }}
    >
        {children}
    </AuthContext.Provider>
    )
}