import { useContext, useEffect } from "react";

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";
import { Use_Process_input_data } from "../../../_universal/Process_input_data.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../../context/Context_initial_data.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";
import { Types_data_change } from "../../../_universal/Process_input_data.js";

interface Types_props{
    initial_data_object: Types_form_data;
}

// THE COMPONENT 
export default function Client_edit({initial_data_object}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Client_edit`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const process_data = useContext(Use_Process_input_data);

    const update_initial_data = useContext(Use_Context_initial_data).update_func;

    function handle_client_change({form_data}:Types_data_change){
        process_data.update_data({table_name:"clients", form_data: form_data})
    }

    function handle_group_project_change({form_data}:Types_data_change){
        process_data.update_data({table_name:"project_groups", form_data: form_data})
    }

    
// MEMOS AND EFFECTS

    useEffect(() =>{
       (async()=>{
            const initial_data_update = await update_initial_data.wait({table_name: "project_groups", entry_id: initial_data_object.id, entry_id_key: "client_id"})
            const project_groups = initial_data_update["project_groups"].data
            console.log(`%c DATA `, `${ log_colors.data }`,`for project_groups`,'\n' ,project_groups);
            if(project_groups.length > 0){
                update_initial_data.update_context(initial_data_update);
                process_data.update_data({table_name:"project_groups", form_data: project_groups})
            }

       })() 

    },[])


// RETURNED VALUES 
    return(
        <div id="cpe_input_box" className="cp_content_box">
            <form className="auto_form">
            {
                initial_data["clients"].info.db_column_info.map((column)=>{
                    return(
                        <Form_auto_input
                            key={`input_for_${column.column_name}`}
                            column_info = {column}
                            initial_data_object={initial_data_object}
                            send_table_data = {({input, db_column}:Types_input_change)=>handle_client_change({form_data:{input:input, db_column:db_column}})}
                        />
                    )
                })
            }
            </form>
            {initial_data["project_groups"] && initial_data["project_groups"].data.length > 0 &&
                <div 
                    className="client_project_group_edit_box"
                >
                    <h3>Project Groups </h3>
                {initial_data["project_groups"].data.map((project_group)=>{
                    return(
                        <div 
                            className="client_project_group_input_box"
                            key={`input_for_${project_group.name}`}    
                        >
                            <Form_auto_input
                                label_name={false}
                                column_info = {{
                                    column_name: "name",
                                    is_nullable: "NO",
                                    input_type: "text"
                                }}
                                initial_data_object={project_group}
                                send_table_data = {({input, db_column}:Types_input_change)=>handle_group_project_change({form_data:{input:input, db_column:db_column}})}
                            />
                     
                        </div>
                    )
                })
                }
                </div>
            }

        </div>
    ); 
}