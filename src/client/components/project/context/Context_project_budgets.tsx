import { createContext, useContext, useState, ReactNode, useEffect, useRef, useMemo } from "react"

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../context/Context_departments_data.js";

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
    reset?:boolean;
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
    const [ready, set_ready] = useState<boolean>(false);

    const departments = useContext(Use_Context_departments_data).show_context;

    function setup_department_budgets(){
        const department_budgets:Types_context_content = {
            total: 0,
            used: 0,
            departments:{}
        }

        departments.forEach((department)=>{
            department_budgets.departments[`dep_id_${department.id}`] = 0;
        })

        budgets.current = department_budgets;
        return department_budgets;
    }

    // UPDATE THE CONTEXT 
    async function update_context({total, dep_id_name, budget, all_budgets, reset }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `${ log_colors.context }`, `for Context_project_budgets`, `prev_vals: `,{...budgets.current});
        if(reset){
            const budget_update = setup_department_budgets()
            return budget_update;
        }

        let update_budget: Types_context_content = {
            ...budgets.current
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
            const exisiting_dep_budget = update_budget.departments[dep_id_name!] ? update_budget.departments[dep_id_name!] : 0; 
            used_budget = Number((budgets.current!.used + (budget - exisiting_dep_budget)).toFixed(2));
            console.log(`%c DATA `, `${ log_colors.data }`,`for used_budget`,'\n' ,used_budget);
            update_budget = {
                ...update_budget,
                used:used_budget,
                departments:{
                    ...update_budget.departments,
                    [dep_id_name!]:budget
                }
                
            }
        }
        console.log(`   %c CONTEXT UPDATE DATA `, `${ log_colors.context }`,`for update_budget`,'\n' ,update_budget);
        budgets.current = update_budget;
        return update_budget;
    }

// MEMOS AND EFFECTS

useMemo(() =>{
    if(departments[0].id !== 0){
        const department_budgets = setup_department_budgets()
        set_send_context(department_budgets);
        console.log(`%c CONTEXT INITIAL DATA `, `${ log_colors.context }`,`for department_budgets`,'\n' ,department_budgets);
        !ready && set_ready(true)
    }
},[departments])

// RETURN THE CONTEXT PROVIDER 
    if(ready){
        return (
            <Use_Context_project_budgets.Provider value={{
                update_func:{
                    now: async (props:Types_context_function)=>{
                        console.log(`%c CONTEXT UPDATE NOW `, `${ log_colors.context }`, `for Context_project_budgets`);
                        set_send_context(await update_context(props))
                    },
                    wait: async (props:Types_context_function) =>{
                        console.log(`%c CONTEXT UPDATE WAIT `, `${ log_colors.context }`, `for Context_project_budgets`);
                        return await update_context(props)
                    },
                    update_context: (props:Types_context_content)=>{
                        console.log(`%c UPDATE CONTEXT DIRECTLY `, `${ log_colors.important }`, `for Context_project_budgets`);
                        set_send_context(props) 
                    }
                },
                show_context:send_context}}
            >
                {children} 
            </Use_Context_project_budgets.Provider> 
        );
    }
}   