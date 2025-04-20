import { createContext, useContext, useState, ReactNode } from "react"
// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_project_data } from "../../../../context/Context_project_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../../../../styles/_log_colors.js";

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
    id?:number;
    employee_id: number;
    project_id:number;
    department_id:number;
    start_date:string;
    budget:number;
    budget_hours:number;
};

interface Types_context_function { 
    employee_id: number;
    department_id:number;
    start_date:string;
    budget:number;
    budget_hours:number;
  };

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {
    employee_id: 0,
    project_id: 0,
    department_id: 0,
    start_date: "",
    budget: 0,
    budget_hours: 0
};

// CONTEXT TO USE 
export const Use_Context_employee_budgets = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_employee_budgets({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    const project_id = useContext(Use_Context_project_data).show_context.current_project;


    // UPDATE THE CONTEXT 
    async function update_context({   }:Types_context_function = {}){
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_employee_budgets`);
        let update_data = {...send_context};







        return(update_data);
    }

// MEMOS AND EFFECTS    

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_employee_budgets.Provider value={{
           update_func:{
               now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
               wait: update_context,
               update_context: set_send_context 
           },
           show_context:send_context}}
        >
            {children} 
        </Use_Context_employee_budgets.Provider> 
    );
}