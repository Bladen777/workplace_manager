import { useContext, useEffect, useState } from "react";
import axios from "axios";
// COMPONENT IMPORTS 
import Input_drop_down from "../../../../_universal/drop_downs/Input_drop_down.js";
import Form_auto_input from "../../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../../../../_universal/Process_input_data.js";
// HOOK IMPORTS 

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../../../context/Context_initial_data.js";
import { Types_search_item } from "../../../../_universal/drop_downs/Input_drop_down.js";
import { Types_data_change } from "../../../../_universal/Process_input_data.js";
import { Types_input_change } from "../../../../_universal/inputs/Form_auto_input.js";

interface Types_props{
    selected_client_id: number;
}

// THE COMPONENT 
export default function job_select({selected_client_id}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `${ log_colors.sub_component }`, `job_select`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const process_data = useContext(Use_Process_input_data);

    const update_initial_data = useContext(Use_Context_initial_data).update_func;

    const [job_list, set_job_list] = useState<Types_form_data[]>([]);
    const [existing_job, set_existing_job] = useState<Types_form_data>({});
    const [new_job, set_new_job] = useState<boolean>(false)


    async function fetch_job_list(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "client_jobs",
                filter_key: "client_id",
                filter_item: selected_client_id
            })

            response.data.forEach(async(item:Types_form_data)=>{
                if(active_entry.submit_method === "edit" && item["client_id"] === initial_data["projects"].data[0].client_id){
                    set_existing_job(item);
                    await update_initial_data.wait({table_name: "client_jobs", entry_id_key:"client_id" ,entry_id:item["client_id"]});
                }
            });

            set_job_list(response.data);
            
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };

    }

    function handle_new_job(){
        const date = new Date().toISOString().slice(0,10);
        const new_job_data = {
            date_added:date,
            client_id: selected_client_id
        }
        process_data.update_data({table_name: "client_jobs", form_data:[new_job_data]})
        set_new_job(true)
    }

    function handle_job_change({input}:{input:Types_search_item}){
        console.log(`%c DATA `, `${ log_colors.data }`,`for input`,'\n' ,input);
        process_data.update_data({table_name: "projects", form_data: {input:input.id , db_column:"job_id"}});
    }

    function handle_form_change({form_data}:Types_data_change){
        console.log(`%c DATA `, `${ log_colors.data }`,`for form_data`,'\n' ,form_data);
        process_data.update_data({table_name:"client_jobs", form_data: form_data})

        
    }

// MEMOS AND EFFECTS

useEffect(() =>{
    fetch_job_list()
},[selected_client_id])

console.log(`%c DATA `, `${ log_colors.data }`,`for job_list.length`,'\n' ,job_list.length);
console.log(`%c DATA `, `${ log_colors.data }`,`for existing_job`,'\n' ,existing_job);
// RETURNED VALUES 
    return(
        <div className="job_select_box">
            {!new_job && 
            <p>* Job:</p>
            }

            {job_list.length > 0 && !new_job &&
                <Input_drop_down
                    table_name={{main:"job"}}
                    selected_entry = {existing_job.name ? String(existing_job.name) : ""}
                    form_table_data={job_list}
                    send_table_data={({input}:{input:Types_search_item})=>{
                            handle_job_change({input:input})
                    }}
                />
            }

            {!new_job &&
            <button 
                className="general_btn"
                onClick={handle_new_job}
                type="button"
            >
                New job
            </button>
            }
            {new_job && 
                <Form_auto_input
                    label_name="New Job Name"
                    column_info = {initial_data["client_jobs"].info.db_column_info[0]}
                    initial_data_object={initial_data["client_jobs"].info.form_data}
                    send_table_data = {({input, db_column}:Types_input_change)=>
                        handle_form_change({form_data:{input:input, db_column:db_column}}
                    )}
                />
            }



            
        </div>
    ); 
}