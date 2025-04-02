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

interface Types_user_check{
  email_exists: boolean;
  is_admin:boolean;
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

    async function check_user(user_email:string){
      try{
        const response = await axios.post("/get_table_info",{
          table_name: "employees",
          sort_field: "admin",
          filter_key: "email",
          filter_item: user_email
        })
        const user_is_admin = response.data[0].admin;
        return {
          email_exists:true,
          is_admin: user_is_admin === "1" ? true : false
        };
      } catch (error){
        console.log(`%c Email doesn't exist in database: `, 'background-color:darkred', error); 
        return{
          email_exists:false,
          is_admin:false
        }
      };

    }

    // UPDATE THE CONTEXT 
    async function update_context({}:Types_context_function = {}){
        try {
          const response = await axios.get("/user_info");
          const data = response.data;
          console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`,`for user_info`, data);
          const user_check:Types_user_check = await check_user(data.email);

          console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for user_check`,'\n' ,user_check);
          
          if(user_check.email_exists){
            return({
              email: data.email,
              is_admin: user_check.is_admin
            })
          } else {
            return(initial_context_content); 
          };
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