import { createContext, useContext, useState, ReactNode } from "react"

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
interface Types_context {
    update_func:Function;
    show_context:Types_context_content; 
};

type Types_context_content = string;

interface Types_context_function {
  section_name:string; 
};

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = "";

// CONTEXT TO USE 
export const Use_Context_Section_Name = createContext<Types_context>({update_func:()=>{}, show_context:initial_context_content })

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_Section_Name({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    // UPDATE THE CONTEXT 
    function update_context({section_name }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Section_Name`);

        set_send_context(section_name);
    }

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_Section_Name.Provider value={{update_func:update_context, show_context:send_context}}>
            {children} 
        </Use_Context_Section_Name.Provider> 
    );
}