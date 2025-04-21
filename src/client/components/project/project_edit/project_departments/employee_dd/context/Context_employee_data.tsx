import axios from "axios";

import { createContext, useContext, useState, ReactNode, useMemo } from "react"
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

interface Types_employee_budget_data{
    id?:number;
    employee_id: number;
    project_id?:number;
    department_id:number;
    start_date:string;
    budget:number;
    budget_hours:number;
}

interface Types_context_content extends Array<Types_employee_budget_data>{ };

interface Types_context_function extends Types_employee_budget_data{ 
    method?:string;
};


// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = [{
    employee_id: 0,
    project_id: 0,
    department_id: 0,
    start_date: "",
    budget: 0,
    budget_hours: 0
}];

// CONTEXT TO USE 
export const Use_Context_employee_data = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});


// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_employee_data({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    const current_project = useContext(Use_Context_project_data).show_context.current_project;


    // FETCH EXISTING DATA FROM THE DATABASE
    async function fetch_employee_budget_data(){

        try{
            const response = await axios.post("/get_table_info", {
                table_name: "employee_budgets",
                filter_key: "project_id",
                filter_item: current_project.current_table_item.id,
            })

            set_send_context(response.data)

        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };


    }

    // UPDATE THE CONTEXT 
    async function update_context({ employee_id, department_id, start_date, budget, budget_hours, method  }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_employee_budgets`);
        let update_data = {...send_context};

        function entry_exists(){
            let entry_exists: boolean | number = false;  
            update_data.forEach((entry:Types_employee_budget_data, index:number)=>{
                if(entry.department_id === department_id && entry.department_id === department_id){
                    entry_exists = index;    
                }
            })
            return entry_exists;
        }


        if(current_project.submit_method === "add"){

        }



        if(method !== "delete"){
            const existing_entry_index = entry_exists();

            if (typeof(existing_entry_index) === "number"){
                update_data[existing_entry_index] = {
                    employee_id: employee_id,
                    department_id: department_id,
                    start_date: start_date,
                    budget: budget,
                    budget_hours: budget_hours
                }
            } else {
                update_data.push({
                    employee_id: employee_id,
                    department_id: department_id,
                    start_date: start_date,
                    budget: budget,
                    budget_hours: budget_hours
                })
            }

        } else {
            const existing_entry_index = entry_exists();
            if (typeof(existing_entry_index) === "number"){
                update_data.splice(existing_entry_index,1)
            }
        }

        return(update_data);
    }

// MEMOS AND EFFECTS    

useMemo(() =>{
    if(current_project.submit_method === "edit"){
        fetch_employee_budget_data()
    } else {
        set_send_context(initial_context_content)
    }

},[current_project])

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_employee_data.Provider value={{
           update_func:{
               now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
               wait: update_context,
               update_context: set_send_context 
           },
           show_context:send_context}}
        >
            {children} 
        </Use_Context_employee_data.Provider> 
    );
}