import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS
import Order_shift from "./control_panel_edits/Order_shift.js";
import Edit_control_panel_entry from "./control_panel_edits/Edit_control_panel_entry.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";
import { Use_Context_Table_Data } from "../context/Context_get_table_data.js";

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_edit as Prop_types} from "../Control_panel.js"

import { Types_column_info } from "../context/Context_db_table_info.js";
import { Types_form_data } from "../context/Context_db_table_info.js";





// THE COMPONENT
export default function Control_panel_edit({submit_method, item_id}:Prop_types) {
    const section_name = useContext(Use_Context_Section_Name).show_context;
    console.log(`%c SUB-COMPONENT `, `background-color:${log_colors.sub_component}`, `Control_panel_edit for `, section_name);

    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    const initial_form_data = useContext(Use_Context_Table_Info).show_context.initial_form_data;
    const initial_table_data = useContext(Use_Context_Table_Data).show_context;
    
    const current_table_data = useRef<Types_form_data[]>(initial_table_data);
    const [status_message, set_status_message] = useState<string>("");


    // ENSURE THE NEW TABLE DATA IS IN A ARRAY FORMAT
    function handle_form_change(form_data:Types_form_data | Types_form_data[]){
        let form_data_array: Types_form_data[] = [];
        if(!Array.isArray(form_data)){
            form_data_array.push(form_data);
            //set_new_table_data(form_data_array);
            current_table_data.current = form_data_array;
        } else {
            //set_new_table_data(form_data)
            current_table_data.current = form_data;
        }
    }

    // SET THE CURRENT ITEM INDEX
    const current_item_index = initial_table_data.findIndex((item) => {
        return item.id === item_id;
    })

    // CHECK TO ENSURE REQUIRED FIELDS ARE NOT LEFT EMPTY BEFORE SUBMITTING
    function check_empty_input(){
        const missing_inputs:string[] = [];
        current_table_data.current.map((current_entry:Types_form_data)=>{
            db_column_info.map((item: Types_column_info) => {
                const null_check = item.is_nullable;
                const current_item = item.column_name;
                if(null_check === "NO" && current_entry[current_item] === "" ){
                    missing_inputs.push(current_item);
                }
            }) 
        })

        let missing_input_strings =""

        missing_inputs.map((item:string, index:number) => {
            const item_string = item.replace("_"," ");
            if(missing_input_strings === ""){
                missing_input_strings += item_string;
            } else if(index === missing_inputs.length - 1){
                missing_input_strings += " & " + item_string;
            }else {
                missing_input_strings += ", " + item_string ;
            }   
        })

        console.log("the not empty inputs:", missing_input_strings);
        return missing_input_strings;
    }

    // SEND THE INFOMATION TO THE DATABASE TO BE ADDED/EDITED
    async function post_form(){
        console.log(`%c THE DATA BEING SENT `, `background-color:${ log_colors.important }`,`for current_table_data.current`,'\n' ,current_table_data.current);
        const missing_input = check_empty_input();

        if(missing_input !== ""){
            set_status_message(`Please enter values for ${missing_input}`)
            return
        }
            try {
                const response = await axios.post("/edit_form_data",{
                    table_name: section_name,
                    filter_key: "id",
                    filter_item: item_id,
                    submit_method: submit_method,
                    db_column_info: db_column_info, 
                    submit_data: current_table_data.current
                })
                console.log("The success_message: ",response.data)
                set_status_message(response.data)

            } catch (error) {
                console.log('%cError posting info to database: ', 'background-color:darkred',error); 
            }
    }
    

        return (
            <article id="control_panel_edits" className="control_panel_action_box">
                <h3>{submit_method === "add" ? "Add" : "Edit"} {section_name}</h3>
                {   
                    db_column_info[0].input_type === "order"
                    ? 
                    <div id={`${section_name}_o_shift_box`} className="o_shift_box cp_content_box">
                        <Order_shift 
                            ele_names = {`cp_${section_name}`}
                            send_table_data = {handle_form_change} 
                            submit_method = {submit_method}
            
                        /> 
                    </div>
                    : 
                    <div id="cpe_input_box" className="cp_content_box">
                        <Edit_control_panel_entry
                            table_data={submit_method === "add" ? initial_form_data : initial_table_data[current_item_index]}
                            send_table_data={handle_form_change}
                        />
                    </div> 
                }

                <div className="cp_utility_bar">
                <button id="cp_done_btn" type="button" className="control_panel_btn" onClick={()=>{post_form()}}> Done </button>
                {status_message !== "" &&
                    <h3>{status_message}</h3>
                }
                </div>
                
            </article>
        )
    
}
