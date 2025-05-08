import { useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS
import Order_shift from "./control_panel_edits/Order_shift.js";
import Employee_input_form from "./control_panel_edits/Employee_input_form.js";
import Form_auto_input, { Types_input_change } from "../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS
import { Use_Context_initial_data } from "../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../../_universal/Process_input_data.js";

// HOOK IMPORTS

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/control_panel/cp_edit.css"

// TYPE DEFINITIONS 

import { Types_data_change } from "../../_universal/Process_input_data.js";
import { Types_post_response } from "../../_universal/Process_input_data.js";

interface Types_props{
    active_table:string;
    handle_cancel_edit_click: Function;
}



// THE COMPONENT
export default function Control_panel_edit({active_table, handle_cancel_edit_click}:Types_props) {
    console.log(`%c SUB-COMPONENT `, `${log_colors.sub_component}`, `Control_panel_edit for `,active_table);

    const initial_data = useContext(Use_Context_initial_data).show_context[active_table];
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const process_data = useContext(Use_Process_input_data);

    const update_initial_data = useContext(Use_Context_initial_data).update_func;

    let target_entry = {};
    
    if(active_entry.submit_method === "edit"){
        initial_data.data.find((entry)=>{
            if(entry.id === active_entry.target_id){
                target_entry = entry;
                return 
            }
        })
    } else {
        target_entry = initial_data.info.form_data
    }
    

    const [status_message, set_status_message] = useState<string>("");

    function handle_form_change({form_data}:Types_data_change){
        console.log(`%c DATA `, `${ log_colors.data }`,`for form_data`,'\n' ,form_data);
        process_data.update_data({table_name:active_table, form_data: form_data})
    }

    async function post_form(){
        console.log(`%c POST FORM `, `${ log_colors.data }`);
        const response:Types_post_response = await process_data.post_data({submit_method:active_entry.submit_method});
        await update_initial_data.now({table_name:active_table});
        console.log(`%c THE POST RESPONSE `, `${ log_colors.data }`,`for response`,'\n' ,response);
        set_status_message(response.message)
    }

// MEMOS AND EFFECTS    


// RETURNED VALUES 
    return (
        <article id="control_panel_edits" className="control_panel_action_box">
            <h3>{active_entry.submit_method === "add" ? "Add" : "Edit"} {active_table}</h3>
            { active_table === "departments" &&
                <Order_shift
                    ele_names = {`cp_${active_table}`}
                    table_name={active_table}
                /> 
            }
            { active_table === "employees" &&
                    <Employee_input_form
                        initial_data_object={target_entry} 
                    />   
            }
            { (active_table !== "departments" && active_table !== "employees") &&
                <div id="cpe_input_box" className="cp_content_box">
                    <form className="auto_form">
                    {
                        initial_data.info.db_column_info.map((column)=>{
                            return(
                                <Form_auto_input
                                    key={`input_for_${column.column_name}`}
                                    column_info = {column}
                                    initial_data_object={target_entry}
                                    send_table_data = {({input, db_column}:Types_input_change)=>handle_form_change({form_data:{input:input, db_column:db_column}})}
                                />
                            )
                        })

                    }
                    </form>
                </div>
            }
            
            
            <div className="cp_utility_bar">
                <button id="cp_done_btn" type="button" 
                        className="cp_utility_bar_btn general_btn" 
                        onClick={()=> post_form() }
                > Save 
                </button>
                <button id="cp_cancel_btn" type="button" className="cp_utility_bar_btn general_btn" 
                        onClick={()=>handle_cancel_edit_click()}> {status_message !== "" ? "Return" : "Cancel"} 
                </button>
                {status_message !== "" &&
                    <h3 className="status_message">{status_message}</h3>
                }
            </div>
            
        </article>
    )
    
}