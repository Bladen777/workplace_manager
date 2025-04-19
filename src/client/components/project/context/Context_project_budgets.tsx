import { createContext, useContext, useState, ReactNode, useEffect } from "react"
// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../context/Context_departments_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

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
    total_budget: number;
    [key:string]:number;
   };



interface Types_context_function {
    department: string;
    budget:number;
};

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {
    total_budget:0
};

// CONTEXT TO USE 
export const Use_Context_project_budgets = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_project_budgets({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    const departments = useContext(Use_Context_departments_data).show_context;

    function setup_department_budgets(){
        const department_budgets = departments.map((department)=>{
            return{
                [department.department.name]:0
            }

        })
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for department_budgets`,'\n' ,department_budgets);

    }

    // UPDATE THE CONTEXT 
    async function update_context({department, budget}:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_project_budgets`);

        const existing_budgets = [...send_context]

        if(department === "total_budget"){
            return({
                total_budget:budget
            });
        } else {
            const department_name = `dep_id_${department}`;
            return({
                [department_name]:budget
            });

        }
    }

// MEMOS AND EFFECTS

useEffect(() =>{
  setup_department_budgets()
},[])

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_project_budgets.Provider value={{
           update_func:{
               now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
               wait: update_context,
               update_context: set_send_context 
           },
           show_context:send_context}}
        >
            {children} 
        </Use_Context_project_budgets.Provider> 
    );
}   