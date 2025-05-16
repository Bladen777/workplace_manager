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
export default function Project_group_select({selected_client_id}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_group_select`, selected_client_id);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const process_data = useContext(Use_Process_input_data);

    const update_initial_data = useContext(Use_Context_initial_data).update_func;

    const [project_group_list, set_project_group_list] = useState<Types_form_data[]>([]);
    const [existing_project_group, set_existing_project_group] = useState<Types_form_data>({});
    const [new_project_group, set_new_project_group] = useState<boolean>(false)


    async function fetch_project_group_list(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "project_groups",
                filter_key: "client_id",
                filter_item: selected_client_id
            })

            let initial_data_update = await update_initial_data.wait({table_name: "project_groups"});

            let item:Types_form_data;

            for await (item of response.data){
                if(active_entry.submit_method === "edit" && item["client_id"] === initial_data["projects"].data[0].client_id){
                    set_existing_project_group(item);
                    initial_data_update = await update_initial_data.wait({table_name: "project_groups", entry_id_key:"client_id" ,entry_id:item["client_id"]});
                }

            }

            //await update_initial_data.update_context(initial_data_update);
            console.log(`%c DATA `, `${ log_colors.important }`,`for initial_data_update`,'\n' ,initial_data_update);
            set_project_group_list(response.data);
            
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };

    }

    function handle_new_project_group(){
        const date = new Date().toISOString().slice(0,10);
        const new_project_group_data = {
            date_added:date,
            client_id: selected_client_id
        }
        process_data.update_data({table_name: "project_groups", form_data:[new_project_group_data]})
        set_new_project_group(true)
    }

    function handle_project_group_change({input}:{input:Types_search_item}){
        console.log(`%c DATA `, `${ log_colors.data }`,`for input`,'\n' ,input);
        process_data.update_data({table_name: "projects", form_data: {input:input.id , db_column:"project_group_id"}});
    }

    function handle_form_change({form_data}:Types_data_change){
        console.log(`%c DATA `, `${ log_colors.data }`,`for form_data`,'\n' ,form_data);
        process_data.update_data({table_name:"project_groups", form_data: form_data})

        
    }

// MEMOS AND EFFECTS

useEffect(() =>{
    fetch_project_group_list()
},[selected_client_id])

console.log(`%c DATA `, `${ log_colors.data }`,`for project_group_list.length`,'\n' ,project_group_list.length);
console.log(`%c DATA `, `${ log_colors.data }`,`for existing_project_group`,'\n' ,existing_project_group);
// RETURNED VALUES 
    return(
        <div className="project_group_select_box">
            {!new_project_group && 
            <p>* Project Group:</p>
            }

            {project_group_list.length > 0 && !new_project_group &&
                <Input_drop_down
                    table_name={{main:"project_group"}}
                    selected_entry = {existing_project_group.name ? String(existing_project_group.name) : ""}
                    form_table_data={project_group_list}
                    send_table_data={({input}:{input:Types_search_item})=>{
                            handle_project_group_change({input:input})
                    }}
                />
            }

            {!new_project_group &&
            <button 
                className="general_btn"
                onClick={handle_new_project_group}
                type="button"
            >
                New Project Group
            </button>
            }
            {new_project_group && 
                <Form_auto_input
                    label_name="New Project Group Name"
                    column_info = {initial_data["project_groups"].info.db_column_info[0]}
                    initial_data_object={initial_data["project_groups"].info.form_data}
                    send_table_data = {({input, db_column}:Types_input_change)=>
                        handle_form_change({form_data:{input:input, db_column:db_column}}
                    )}
                />
            }



            
        </div>
    ); 
}