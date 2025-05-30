import axios from "axios";
import { createContext, useContext, useState, ReactNode, useMemo, useRef } from "react"

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../../../../../_universal/Process_input_data.js";

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

interface Types_employee_budget_data{
    id?:number;
    employee_id: number;
    project_id?:number;
    department_id:number;
    start_date:string | undefined;
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
    start_date: undefined,
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

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const process_data = useContext(Use_Process_input_data);

    const update_initial_data = useContext(Use_Context_initial_data).update_func;

    const current_project = initial_data["projects"].data[0];

    const employee_data_ref = useRef<Types_context_content>([])

    // FETCH EXISTING DATA FROM THE DATABASE
    async function fetch_employee_budget_data(){

        try{
            const response = await axios.post("/get_table_info", {
                table_name: "project_employees",
                filter_key: "project_id",
                filter_item: current_project.id,
            })
            
            set_send_context(response.data)
            employee_data_ref.current = response.data

        } catch (error){
          console.log(`%c  has the following error: `, 'darkred', error); 
        };


    }

    // UPDATE THE CONTEXT 
    async function update_context({ id, employee_id, department_id, start_date, budget, budget_hours, method  }:Types_context_function){

        let update_data:Types_context_content = [...employee_data_ref.current];
        let entry_index:number | boolean = false;

        console.log(`%c DATA `, `${ log_colors.data }`,`for update_data`,'\n' ,update_data);
        console.log(`%c DATA `, `${ log_colors.data }`,`for department_id`,'\n' ,department_id);
        console.log(`%c DATA `, `${ log_colors.data }`,`for employee_id`,'\n' ,employee_id);

        update_data.forEach((s_item, s_index)=>{
            if(s_item.employee_id === employee_id && s_item.department_id === department_id ){
                entry_index = s_index;
            } else if (!employee_id && employee_id !== -1 && s_item.department_id === department_id){
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
                } else {
                    update_data[entry_index] = {
                        ...update_data[entry_index],
                        budget: budget,
                        budget_hours: budget_hours
                    }
                }
            } else {
                const project_id = active_entry.target_id;
                update_data.push({
                    id: id,
                    employee_id: employee_id,
                    department_id: department_id,
                    project_id:  project_id ? project_id : -1,
                    start_date: start_date,
                    budget: budget,
                    budget_hours: budget_hours
                })
            }

        } else {
            console.log(`%c DATA `, `${ log_colors.data }`,`for delete_entry ${entry_index}`);
            if (typeof(entry_index) === "number"){
                update_data.splice(entry_index,1)
            }
        }

        
        console.log(`   %c CONTEXT UPDATE DATA `, `${ log_colors.context }`,`for Context_employee_data`,'\n' ,update_data);
        process_data.update_data({table_name: "project_employees", form_data:update_data })
        employee_data_ref.current = update_data;
        return(update_data);
    }

// MEMOS AND EFFECTS    

useMemo(() =>{
    if(current_project && current_project.submit_method === "edit"){
        fetch_employee_budget_data()
    } else {
        set_send_context(initial_context_content)
    }

},[current_project])

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_employee_data.Provider value={{
                update_func:{
                    now: async (props:Types_context_function)=>{
                        console.log(`%c CONTEXT UPDATE NOW `, `${ log_colors.context }`, `for Context_employee_data`);
                        set_send_context(await update_context(props))
                    },
                    wait: async (props:Types_context_function) =>{
                        console.log(`%c CONTEXT UPDATE WAIT `, `${ log_colors.context }`, `for Context_employee_data`);
                        return await update_context(props)
                    },
                    update_context: (props:Types_context_content)=>{
                        console.log(`%c UPDATE CONTEXT DIRECTLY `, `${ log_colors.important }`, `for Context_employee_data`);
                        set_send_context(props) 
                    }
                },
                show_context:send_context}}
            >
            {children} 
        </Use_Context_employee_data.Provider> 
    );
}