import { useContext, useEffect, useMemo, useRef, useState } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/control_panel/cp_edit.css"

// CONTEXT IMPORTS
import { Use_Context_departments_data } from "../../context/Context_departments_data.js";
import { Use_Context_initial_data } from "../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../../_universal/Process_input_data.js";

// HOOK IMPORTS

// COMPONENT IMPORTS
import Order_shift from "./control_panel_edits/Order_shift.js";
import Employee_input_form from "./control_panel_edits/Employee_input_form.js";
import Client_edit from "./control_panel_edits/Client_edit.js";

// TYPE DEFINITIONS 
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

    const update_department_data = useContext(Use_Context_departments_data).update_func;
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

    async function post_form(){
        console.log(`%c POST FORM `, `${ log_colors.data }`);
        const response:Types_post_response = await process_data.post_data({submit_method:active_entry.submit_method});
        await update_initial_data.now({table_name:active_table});
        if(active_table === "departments"){
            update_department_data.now();
        }
        console.log(`%c THE POST RESPONSE `, `${ log_colors.data }`,`for response`,'\n' ,response);
        set_status_message(response.message)
                setTimeout(() => {
            set_status_message("saved");
        }, 2000);
    }

// MEMOS AND EFFECTS    

    useMemo(() =>{
        if(active_entry.submit_method === "edit"){
            const existing_entry_data = initial_data.data.find((entry)=>{
                if(entry.id === active_entry.target_id){
                    return entry
                }
            })
            process_data.update_data({table_name: active_table, form_data: [existing_entry_data]})
        }
    },[])

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
            { active_table === "clients" &&
                    <Client_edit
                        initial_data_object={target_entry} 
                    />   
            }

            
            <div className="cp_utility_bar">
                <button id="cp_done_btn" type="button" 
                        className="cp_utility_bar_btn general_btn" 
                        onClick={()=> post_form() }
                > 
                    <h4>Save</h4> 
                </button>
                <button id="cp_cancel_btn" type="button" className="cp_utility_bar_btn general_btn" 
                        onClick={()=>handle_cancel_edit_click()}
                > 
                    <h4>{status_message !== "" ? "Return" : "Cancel"}</h4> 
                </button>
                    {status_message !== "" && status_message !== "saved" &&
                        <h3 className="status_message">{status_message}</h3>
                    }
            </div>
            
        </article>
    )
    
}