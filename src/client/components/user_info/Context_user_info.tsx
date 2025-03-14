import axios from "axios";
import { createContext, useContext, useState, ReactNode } from "react"

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../styles/_log_colors.js";

// TYPE DEFINITIONS 
interface Types_context {
  update_func:{
      now:Function;
      wait:Function;
      update_context: Function;
  };
  show_context:Types_context_content; 
};

interface Types_context_content extends Types_user_info{   };

interface Types_context_function {  };

export interface Types_user_info {
  email: string
  is_admin: boolean
}

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {email:"wait", is_admin:false};

// CONTEXT TO USE 
export const Use_Context_user_info = createContext<Types_context>({
    update_func:{
        now: ()=>{},
        wait: ()=>{}, 
        update_context: ()=>{}
    },
    show_context:initial_context_content
});
// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_user_info({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    // UPDATE THE CONTEXT 
    async function update_context({}:Types_context_function = {}){
        try {
          const response = await axios.get("/user_info");
          const data = response.data;
          console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`,`for user_info`, data);
            return({
                email: data.email,
                is_admin: data.is_admin
              })
    
        } catch (error) {
          console.log('%cError fetching user info: ', 'background-color:darkred',error);
          return(initial_context_content);    
        };
    }

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_user_info.Provider value={{
          update_func:{
              now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
              wait: update_context,
              update_context: set_send_context 
          },
          show_context:send_context}}
      >    {children} 
        </Use_Context_user_info.Provider> 
    );
}