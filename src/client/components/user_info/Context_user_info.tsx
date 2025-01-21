import { createContext, useContext, useState, ReactNode } from "react"

// TYPE DEFINITIONS
export interface Types_user_info {
    email: string
    is_admin: boolean
  }

  interface Types_context{
    update_func:Function,
    show_context: Types_user_info
}

const initial_user_info = {email:"", is_admin:false};

// The Value to use
export const Use_Context_User_Info = createContext<Types_context>({update_func:()=>{},show_context:initial_user_info});

export function Update_Context_User_Info(user_info:string){
    return useContext(Use_Context_User_Info).update_func;
}

// The Component returned 
export function Provide_Context_User_Info({children}:{children:ReactNode}) {

    const [user_info, set_user_info] = useState<Types_user_info>(initial_user_info)

    function change_user_info(value:Types_user_info){
            set_user_info(value)
    }

  return (
    <Use_Context_User_Info.Provider value={{update_func:change_user_info, show_context: user_info }}>
        {children}
    </Use_Context_User_Info.Provider>
  )
}