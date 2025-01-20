import { Children, createContext, useContext, useState, ReactNode } from "react"

// TYPE DEFINITIONS
export interface Types_user_info {
    email: string,
    is_admin: boolean,
  }

const initial_user_info = {email:"", is_admin:false};

export const Use_Context_User_Info = createContext<Types_user_info>(initial_user_info);

const Update_Context = createContext<(values:Types_user_info) => void>(() => {});

export function Update_Context_User_Info({email, is_admin}:Types_user_info){
    return useContext(Update_Context);
}

export function Provide_Context_User_Info({children}:{children:ReactNode}) {

    const[user_info, set_user_info] = useState<Types_user_info>(initial_user_info)

    function update_user_info(values:Types_user_info){
        set_user_info(values)
    }

  return (
    <Use_Context_User_Info.Provider value={user_info}>
        <Update_Context.Provider value={update_user_info}>
        {children}
        </Update_Context.Provider>
    </Use_Context_User_Info.Provider>
  )
}
