import axios from "axios";
import { createContext, useContext, useState, ReactNode } from "react"

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

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
  email: string;
  is_admin: boolean;
  id: number;
}

interface Types_user_check{
  email_exists: boolean;
  is_admin:boolean;
  id: number;
}

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {email:"wait", is_admin:false, id:-1};

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
          filter_key: "email",
          filter_item: user_email
        })
        const user_is_admin = response.data[0].admin;
        return {
          email_exists:true,
          is_admin: user_is_admin === "1" ? true : false,
          id: response.data[0].id
        };
      } catch (error){
        console.log(`%c Email doesn't exist in database: `, 'darkred', error); 
        return{
          email_exists:false,
          is_admin:false,
          id:-1
        }
      };

    }

    // UPDATE THE CONTEXT 
    async function update_context({}:Types_context_function = {}){
        try {
          const response = await axios.get("/user_info");
          const data = response.data;
          const user_check:Types_user_check = await check_user(data.email);

          console.log(` %c CONTEXT UPDATE DATA `, `${ log_colors.context }`,`for user data for ${data.email}`,'\n' ,user_check);
          
          if(user_check.email_exists){
            return({
              email: data.email,
              is_admin: user_check.is_admin,
              id: user_check.id
            })
          } else {
            return(initial_context_content); 
          };
        } catch (error) {
          console.log('%cError fetching user info: ', 'darkred',error);
          return(initial_context_content);    
        };
    }

// MEMOS AND EFFECTS     

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_user_info.Provider value={{
          update_func:{
              now: async (props:Types_context_function)=>{
                  console.log(`%c CONTEXT UPDATE NOW `, `${ log_colors.context }`, `for Context_user_info`);
                  set_send_context(await update_context(props))
              },
              wait: async (props:Types_context_function) =>{
                  console.log(`%c CONTEXT UPDATE WAIT `, `${ log_colors.context }`, `for Context_user_info`);
                  return await update_context(props)
              },
              update_context: (props:Types_context_content)=>{
                  console.log(`%c UPDATE CONTEXT DIRECTLY `, `${ log_colors.important }`, `for Context_user_info`);
                  set_send_context(props) 
              }
          },
          show_context:send_context}}
        >    
        {children} 
        </Use_Context_user_info.Provider> 
    );
}