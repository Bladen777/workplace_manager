import { createContext, useContext, useState, ReactNode, useEffect, useRef, useMemo } from "react"
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

export interface Types_department_budgets {
    [key:string]:number;
}

interface Types_context_content {
    total: number;
    used: number;
    departments:Types_department_budgets;
   };

interface Types_context_function {
    total?:boolean
    dep_id_name?: string;
    budget:number;
    all_budgets:Types_context_content;
};

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {
    total:0,
    used:0,
    departments:{}
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
    const budgets = useRef<Types_context_content>(initial_context_content);

    const departments = useContext(Use_Context_departments_data).show_context;

    function setup_department_budgets(){
        const department_budgets:Types_context_content = {
            total:send_context.total,
            used: send_context.used,
            departments:{}
        }

        departments.forEach((department)=>{
            department_budgets.departments[`dep_id_${department.id}`] = 0;
        })

        budgets.current = department_budgets;
        set_send_context(department_budgets);
     
        console.log(`   %c CONTEXT DATA `, `${ log_colors.data }`,`for department_budgets`,'\n' ,department_budgets);
    }

    // UPDATE THE CONTEXT 
    async function update_context({total, dep_id_name, budget, all_budgets}:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `${ log_colors.context }`, `for Context_project_budgets`, `total: `,total);
        let update_budget: Types_context_content = {
            ...budgets.current!
        }

        let used_budget:number;

        if(all_budgets){
            update_budget = all_budgets;
        } else if(total){
            update_budget = {
                ...update_budget,
                total:budget
            }
        } else{
            used_budget = Number((budgets.current!.used + (budget - update_budget.departments[dep_id_name!])).toFixed(2));
            update_budget = {
                ...update_budget,
                used:used_budget,
                departments:{
                    ...update_budget.departments,
                    [dep_id_name!]:budget
                }
                
            }
        }
        console.log(`   %c CONTEXT DATA `, `${ log_colors.context }`,`for update_budget`,'\n' ,update_budget);
        budgets.current = update_budget;
        return update_budget;
    }

// MEMOS AND EFFECTS

useMemo(() =>{
    if(departments[0].id !== 0){
        console.log(`%c DATA `, `${ log_colors.important_2 }`,`for departments`,'\n' ,departments);
        setup_department_budgets()
    }
},[departments])

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