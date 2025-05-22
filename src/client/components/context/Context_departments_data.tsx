import { createContext, useState, ReactNode, useEffect, useMemo } from "react"
import axios from "axios";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS 
import { Types_form_data } from "./Context_initial_data.js";
interface Types_context {
    update_func:{ 
        now:Function;
        wait:Function;
        update_context:Function;
    }; 
    show_context:Types_context_content; 
};

interface Types_context_content extends Array<Types_department_data>{};

interface Types_context_function {   };

export interface Types_department_data{
    id:number;
    name:string;
    color:string;
}

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = [{
        id:0,
        name:"",
        color:""
}];

// CONTEXT TO USE 
export const Use_Context_departments_data = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_departments_data({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);
    const [ready, set_ready] = useState<boolean>(false);

    // UPDATE THE CONTEXT 
    async function update_context({}:Types_context_function = {}){

        try{
            const response = await axios.post("/get_table_info",{
                table_name: "departments"
            })

            const data = response.data.map((item:Types_form_data)=>{
                return{
                    id:item.id,
                    name:item.department_name,
                    color:item.department_color
                }
            })
            console.log(`   %c CONTEXT UPDATE DATA `, `${ log_colors.context }`,`for department data`,'\n' ,data);
            return(data)
        } catch (error){
          console.log(`%c  has the following error: `, 'darkred', error); 
        };
    }

// MEMOS AND EFFECTS     
    useMemo(() =>{
        (async () =>{
            set_send_context(await update_context({}))
            set_ready(true);
        })()
    },[])

// RETURN THE CONTEXT PROVIDER
    if(ready){
        return (
            <Use_Context_departments_data.Provider value={{
                update_func:{
                    now: async (props:Types_context_function)=>{
                        console.log(`%c CONTEXT UPDATE NOW `, `${ log_colors.context }`, `for Context_departments_data`);
                        set_send_context(await update_context(props))
                    },
                    wait: async (props:Types_context_function) =>{
                        console.log(`%c CONTEXT UPDATE WAIT `, `${ log_colors.context }`, `for Context_departments_data`);
                        return await update_context(props)
                    },
                    update_context: (props:Types_context_content)=>{
                        console.log(`%c UPDATE CONTEXT DIRECTLY `, `${ log_colors.important }`, `for Context_departments_data`);
                        set_send_context(props) 
                    }
                },
                show_context:send_context}}
            >
                {children} 
            </Use_Context_departments_data.Provider> 
        );
    }
}
