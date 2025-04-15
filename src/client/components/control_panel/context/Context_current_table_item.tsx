import { createContext, useContext, useState, ReactNode } from "react"

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Types_form_data } from "./Context_db_table_info.js";

interface Types_context {
    update_func:{
        now:Function;
        wait:Function;
        update_context: Function;
    };
    show_context:Types_context_content; 
};

interface Types_context_content {
    current_table_item:Types_form_data;
    submit_method:string;
}

interface Types_context_function extends Types_context_content{};

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {current_table_item:{}, submit_method:""};

// CONTEXT TO USE 
export const Use_Context_current_table_item = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});


// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_current_table_item({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    // UPDATE THE CONTEXT 
    async function update_context({ current_table_item, submit_method  }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_current_table_item`, "\n" , current_table_item);
        return({current_table_item:current_table_item , submit_method:submit_method});
    }

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_current_table_item.Provider value={{
            update_func:{
                now:async (props:Types_context_function)=>{set_send_context(await update_context(props))},
                wait:update_context,
                update_context:set_send_context 
            },
            show_context:send_context}}
        > 
           {children} 
        </Use_Context_current_table_item.Provider> 
    );
}