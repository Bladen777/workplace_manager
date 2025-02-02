import axios from "axios";
import { createContext, useContext, useState, ReactNode } from "react"

// LOG STYLE IMPORTS
import { log_colors } from "../../styles/log_colors.js";

// TYPE DEFINITIONS
export interface Types_user_info {
    email: string
    is_admin: boolean
  }

  interface Types_context{
    update_func:Function,
    show_context: Types_user_info
}



const initial_user_info = {email:"wait", is_admin:false};

// The Value to use
export const Use_Context_User_Info = createContext<Types_context>({update_func:()=>{},show_context:initial_user_info});

// The Component returned 
export function Provide_Context_User_Info({children}:{children:ReactNode}) {

    const [user_info, set_user_info] = useState<Types_user_info>(initial_user_info)

    async function change_user_info(){
        try {
          const response = await axios.get("/user_info");
          const data = response.data;
          console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`,`for user_info`, data);
              set_user_info({
                email: data.email,
                is_admin: data.is_admin
              })
    
        } catch (error) {
          console.log('%cError fetching user info: ', 'background-color:darkred',error);    
        }
      }

    
  return (
    <Use_Context_User_Info.Provider value={{update_func:change_user_info, show_context: user_info }}>
        {children}
    </Use_Context_User_Info.Provider>
  )
}