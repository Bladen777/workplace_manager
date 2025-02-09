import { createContext, useContext, useState, ReactNode } from "react"

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Types_form_data } from "./Context_db_table_info.js";

interface Types_context {
    update_func:Function;
    show_context:Types_context_content; 
};

interface Types_context_content extends Types_form_data {}

interface Types_context_function{
    current_table_item:Types_form_data;
};

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {};

// CONTEXT TO USE 
export const Use_Context_current_table_item = createContext<Types_context>({update_func:()=>{}, show_context:initial_context_content })

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_current_table_item({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    // UPDATE THE CONTEXT 
    function update_context({ current_table_item  }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_current_table_item`, current_table_item);

        set_send_context(current_table_item);
    }

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_current_table_item.Provider value={{update_func:update_context, show_context:send_context}}>
            {children} 
        </Use_Context_current_table_item.Provider> 
    );
}