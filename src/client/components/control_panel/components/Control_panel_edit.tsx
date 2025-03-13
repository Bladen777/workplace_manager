import { useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS
import Order_shift from "./control_panel_edits/Order_shift.js";
import Employee_input_form from "./control_panel_edits/Employee_input_form.js";
import Form_auto_input from "../../_universal/inputs/Form_auto_input.js";
import Select_departments from "../../_universal/table_data/Select_departments.js";
import Process_input_data from "../../_universal/Process_input_data.js";

// CONTEXT IMPORTS
import { Use_Context_table_info } from "../context/Context_db_table_info.js";
import { Use_Context_table_data } from "../context/Context_get_table_data.js";
import { Use_Context_current_table_item } from "../context/Context_current_table_item.js";
import { Use_Context_departments_data } from "../../context/Context_departments_data.js";

// STYLE IMPORTS
import "../../../styles/control_panel/cp_edit.css"

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Types_form_data } from "../context/Context_db_table_info.js";
import { Types_input_change } from "../../_universal/inputs/Form_auto_input.js";
import { Types_data_change } from "../../_universal/Process_input_data.js";



// THE COMPONENT
export default function Control_panel_edit({handle_cancel_edit_click}:{handle_cancel_edit_click:Function}) {
    const section_name = useContext(Use_Context_table_info).show_context.table_name;
    console.log(`%c SUB-COMPONENT `, `background-color:${log_colors.sub_component}`, `Control_panel_edit for `,section_name);

    const db_column_info = useContext(Use_Context_table_info).show_context.db_column_info;
    const initial_form_data = useContext(Use_Context_table_info).show_context.initial_form_data;
    const current_table_item = useContext(Use_Context_current_table_item).show_context.current_table_item;
    const submit_method = useContext(Use_Context_current_table_item).show_context.submit_method

    let starting_data: Types_form_data[] = [current_table_item];
    if(submit_method === "add"){
        starting_data = [initial_form_data] 
    } 

    const [status_message, set_status_message] = useState<string>("");
    const process_data = Process_input_data()

    function handle_form_change({table_name, form_data}:Types_data_change){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data);
        process_data.handle_form_change({table_name: table_name, form_data: form_data})
    }

    async function post_form(){
        const response:string = await process_data.post_form({submit_method:submit_method})
        set_status_message(response)
    }

    useEffect(() =>{
        handle_form_change({table_name:section_name, form_data:starting_data})
      },[])
  

console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for db_column_info[0]`,'\n' ,db_column_info[0]);

    // RETURNED VALUES 
    return (
        <article id="control_panel_edits" className="control_panel_action_box">
            <h3>{submit_method === "add" ? "Add" : "Edit"} {section_name}</h3>
            {   
                section_name === "departments"
                ? 
                <Order_shift
                    submit_method = {submit_method} 
                    ele_names = {`cp_${section_name}`}
                    send_table_data = {handle_form_change} 
                /> 

                :
                section_name === "employees" 
                ?
                <div id="cpe_input_box" className="cp_content_box">
                    <Employee_input_form 
                        send_table_data = {handle_form_change} 
                    />
                    {
             
                        <Select_departments 
                        submit_method={submit_method}
                        send_table_data = {handle_form_change}
                    />
                
                    } 
                    
                    </div>
                : 
                <div id="cpe_input_box" className="cp_content_box">
                    <form className="auto_form">
                    {
                        db_column_info.map((column)=>{
                            return(
                                <Form_auto_input
                                    key={`input_for_${column.column_name}`}
                                    column_info = {column}
                                    send_table_data = {(form_data:Types_input_change)=>{handle_form_change({form_data:form_data})}}
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
                > Done 
                </button>
                <button id="cp_cancel_btn" type="button" className="cp_utility_bar_btn general_btn" 
                        onClick={()=>handle_cancel_edit_click()}> {status_message !== "" ? "Return" : "Cancel"} 
                </button>
                {status_message !== "" &&
                    <h3>{status_message}</h3>
                }
            </div>
            
        </article>
    )
    
}