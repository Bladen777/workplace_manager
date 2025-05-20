import axios from "axios";
import { createContext, useContext, useState, ReactNode, useMemo, useRef } from "react"

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../../../../_universal/Process_input_data.js";

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

interface Types_department_budget_data{
    id?:number;
    project_id?:number;
    department_id:number;
    start_date:string | undefined;
    finish_date:string | undefined;
    budget:number;
}

interface Types_context_content extends Array<Types_department_budget_data>{ };

interface Types_context_function extends Types_department_budget_data{ 
    method?:string;
};


// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = [{
    project_id: 0,
    department_id: 0,
    start_date: undefined,
    finish_date: undefined,
    budget: 0,
}];

// CONTEXT TO USE 
export const Use_Context_project_department_data = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});


// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_project_department_data({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const process_data = useContext(Use_Process_input_data);

    const update_initial_data = useContext(Use_Context_initial_data).update_func;

    const current_project = initial_data["projects"].data[0];

    const department_data_ref = useRef<Types_context_content>([])

    // FETCH EXISTING DATA FROM THE DATABASE
    async function fetch_department_budget_data(){

        try{
            const response = await axios.post("/get_table_info", {
                table_name: "project_departments",
                filter_key: "project_id",
                filter_item: current_project.id,
            })
            
            set_send_context(response.data)
            department_data_ref.current = response.data

        } catch (error){
          console.log(`%c  has the following error: `, 'darkred', error); 
        };


    }

    // UPDATE THE CONTEXT 
    async function update_context({ id, department_id, start_date, finish_date, budget, method  }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `${ log_colors.context }`, `for Context_project_departments`);
        let update_data:Types_context_content = [...department_data_ref.current];
        console.log(`%c DATA `, `${ log_colors.data }`,`for ...department_data_ref.current`,'\n' ,...department_data_ref.current);
        console.log(`%c DATA `, `${ log_colors.data }`,`for update_data`,'\n' ,...update_data);

        let entry_index:number | boolean = false;
        update_data.forEach((s_item, s_index)=>{
            if(s_item.department_id === department_id){
                entry_index = s_index;
            }
        })

        console.log(`%c DATA `, `${ log_colors.data }`,`for entry_index`,'\n' ,entry_index);
        if(method !== "delete"){
            if (typeof(entry_index) === "number"){
                if(start_date){
                    update_data[entry_index] = {
                        ...update_data[entry_index],
                        start_date: start_date
                    }
                } 
                if(finish_date){
                    update_data[entry_index] = {
                        ...update_data[entry_index],
                        finish_date: finish_date
                    }
                } 
                
                if (budget){
                    update_data[entry_index] = {
                        ...update_data[entry_index],
                        budget: budget,
                    }
                }

            } else {
                const project_id = active_entry.target_id;
                update_data.push({
                    id: id,
                    department_id: department_id,
                    project_id:  project_id ? project_id : -1,
                    start_date: start_date,
                    finish_date: finish_date,
                    budget: budget,
                })
            }

        } else {
            console.log(`%c DATA `, `${ log_colors.data }`,`for delete_entry ${entry_index}`);
            if (typeof(entry_index) === "number"){
                update_data.splice(entry_index,1)
            }
        }

        console.log(`%c DATA `, `${ log_colors.data }`,`for update_data`,'\n' ,update_data);
        process_data.update_data({table_name: "project_departments", form_data:update_data })
        department_data_ref.current = update_data;
        return(update_data);
    }

// MEMOS AND EFFECTS    

useMemo(() =>{
    if(current_project && current_project.submit_method === "edit"){
        fetch_department_budget_data()
    } else {
        set_send_context(initial_context_content)
    }

},[current_project])

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_project_department_data.Provider value={{
           update_func:{
               now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
               wait: update_context,
               update_context: set_send_context 
           },
           show_context:send_context}}
        >
            {children} 
        </Use_Context_project_department_data.Provider> 
    );
}