import { createContext, useState, ReactNode, useEffect } from "react"
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Types_form_data } from "../control_panel/context/Context_db_table_info.js";

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
    department: {
        id:number;
        name:string;
        color:string;
    };
}

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = [{
    department:{
        id:0,
        name:"",
        color:""
    }
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
console.log(`%c CONTEXT `, `background-color:${ log_colors.context }`,`for send_context`,'\n' ,send_context);

    // UPDATE THE CONTEXT 
    async function update_context({   }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_departments_data`);

        try{
            const response = await axios.post("/get_table_info",{
                table_name: "departments"
            })

            const data = response.data.map((item:Types_form_data)=>{
                return{
                    department:{
                        id:item.id,
                        name:item.department_name,
                        color:item.department_color
                    }
                }
            })
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for data`,'\n' ,data);
            return(data)
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };
    }

    useEffect(() =>{
        (async () =>{
            set_send_context(await update_context({}))
        })()
    },[])

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_departments_data.Provider value={{
           update_func:{
               now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
               wait: update_context,
               update_context: set_send_context 
           },
           show_context:send_context}}
        >
            {children} 
        </Use_Context_departments_data.Provider> 
    );
}