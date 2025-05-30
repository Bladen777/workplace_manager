import { createContext, useContext, useState, ReactNode, useRef } from "react"

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
        update_context:Function;
    }; 
    show_context:Types_context_content; 
};

interface Types_context_content {
    submit_method?:string;
    target_id?:number;
};

interface Types_context_function extends Types_context_content{   };

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {
    submit_method:"",
    target_id:0
};

// CONTEXT TO USE 
export const Use_Context_active_entry = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_active_entry({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);
    const context_ref = useRef<Types_context_content>(initial_context_content);

    // UPDATE THE CONTEXT 
    async function update_context({submit_method, target_id }:Types_context_function){

        const update_data = {...context_ref.current}

        if(submit_method){
            update_data.submit_method = submit_method;
        } 
        if(target_id){
            update_data.target_id = target_id;
        }
       
        context_ref.current = update_data;
        console.log(`   %c CONTEXT UPDATE DATA `, `${ log_colors.context }`, `for Context_active_entry`, context_ref.current);
        return update_data;
    }


// MEMOS AND EFFECTS

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_active_entry.Provider value={{
            update_func:{
                now: async (props:Types_context_function)=>{
                    console.log(`%c CONTEXT UPDATE NOW `, `${ log_colors.context }`, `for Context_active_entry`);
                    set_send_context(await update_context(props))
                },
                wait: async (props:Types_context_function) =>{
                    console.log(`%c CONTEXT UPDATE WAIT `, `${ log_colors.context }`, `for Context_active_entry`);
                    return await update_context(props)
                },
                update_context: (props:Types_context_content)=>{
                    console.log(`%c UPDATE CONTEXT DIRECTLY `, `${ log_colors.important }`, `for Context_active_entry`,`\n`, props);
                    set_send_context(props) 
                }
            },
            show_context:send_context}}
        >
            {children} 
        </Use_Context_active_entry.Provider> 
    );
}