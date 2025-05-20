import { createContext, useContext, useState, ReactNode } from "react"
// STYLE IMPORTS 
    /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js"; 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS 
interface Types_context {
    update_func:{ 
        now:Function;
        wait:Function;
        update_context:Function;
    }; 
    show_context:Types_context_content; 
};

interface Types_context_content {   };

interface Types_context_function {   };

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {};

// CONTEXT TO USE 
export const Use_Context_project_budget_tracker = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_project_budget_tracker({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    // UPDATE THE CONTEXT 
    async function update_context({   }:Types_context_function = {}){
        console.log(`%c CONTEXT UPDATE `, `${ log_colors.context }`, `for Context_project_budget_tracker`);

        return();
    }


// MEMOS AND EFFECTS

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_project_budget_tracker.Provider value={{
           update_func:{
               now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
               wait: update_context,
               update_context: set_send_context 
           },
           show_context:send_context}}
        >
            {children} 
        </Use_Context_project_budget_tracker.Provider> 
    );
}