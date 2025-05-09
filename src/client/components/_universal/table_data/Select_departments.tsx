import { useContext, useEffect, useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../context/Context_departments_data.js";
import { Use_Context_initial_data } from "../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../Process_input_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../context/Context_initial_data.js";
import { Types_input_change } from "../inputs/Form_auto_input.js";
import { Types_department_data } from "../../context/Context_departments_data.js";

interface Types_props{
    employee_id:number | undefined;
}

// THE COMPONENT 
export default function Select_departments({employee_id}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Select_departments`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const process_data = useContext(Use_Process_input_data);

    const update_initial_data = useContext(Use_Context_initial_data).update_func;

    const initial_department_data = useContext(Use_Context_departments_data).show_context;

    const [departments, set_departments] = useState<Types_form_data[]>([]);
    const [input_data, set_input_data] = useState<Types_form_data>({});


    function handle_input_change({input, db_column}:Types_input_change){
        set_input_data((prev_vals)=>{
            const update_data = {...prev_vals, [db_column]:input}
            return update_data;
        })
        process_data.update_data({table_name:"employee_departments", form_data:{input: input, db_column:db_column}})
    }

    // GET THE DEPARTMENT NAMES FOR NEW ENTRY
    async function define_department_inputs(){

            const dep_names:Types_form_data[] = [];
            const form_data:Types_form_data = {};

            console.log(`%c DATA `, `${ log_colors.data }`,`for initial_department_data`,'\n' ,initial_department_data);
        
            initial_department_data.map((item:Types_department_data)=>{
                const dep_name = `dep_id_${item.id}`
                dep_names.push({
                    department_name: item.name,
                    [dep_name]: "0"
                })
                form_data[dep_name] = "0";
                
            })
            set_departments(dep_names);
            if(active_entry.submit_method === "add"){
                set_input_data(form_data);
                process_data.update_data({table_name:"employee_departments", form_data:[form_data]})
            }
    }

    
    // GET THE DEPARTMENT DATA FOR EXISTING ENTRY
    async function fetch_departments(){
        const initial_data_update = await update_initial_data.wait({table_name: "employee_departments", entry_id: employee_id, entry_id_key: "employee_id"})
        const existing_dep_data = initial_data_update["employee_departments"].data[0];

        if(existing_dep_data){
            const form_data:Types_form_data = {};
            Object.keys(existing_dep_data).map((column_name)=>{
                if(!column_name.includes("employee_id") && column_name !== "id"){
                form_data[column_name] = existing_dep_data[column_name];
                }
            });

            console.log(`%c DATA `, `${ log_colors.data }`,`for Fetched form_data`,'\n' ,form_data);
            process_data.update_data({table_name:"employee_departments", form_data:[existing_dep_data]})
            
            set_input_data(form_data);
        }
        update_initial_data.update_context(initial_data_update);
    }

// MEMOS AND EFFECTS    
    useEffect(() =>{
        define_department_inputs()
        if(active_entry.submit_method === "edit"){
            fetch_departments()
        }
    },[])

// RETURNED VALUES 
    return(
        <form className="select_departments_form">
            <h3> Select Departments </h3>

            {  departments.map((item)=>{
                const key_name = Object.keys(item)[1];
                const item_val = input_data[key_name];
                
                return(
                    <label 
                        className="auto_form_input_label"
                        key={key_name}
                    >
                        <p>{item.department_name}:</p>   
                        <input

                            type="checkbox"
                            checked = {(item_val === "1") ? true : false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                                let value = "0"
                                    if(e.target.checked){
                                        value="1"
                                    } 
                                handle_input_change({input:value, db_column:key_name})
                            }}              
                        >
                        
                        </input>
                    </label>
                )
            })}

        </form>
    ); 
}