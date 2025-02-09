import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS
import Order_shift from "./control_panel_edits/Order_shift.js";
import Employee_input from "./control_panel_edits/Employee_input.js";
import Control_panel_input from "./control_panel_edits/Control_panel_input.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";
import { Use_Context_Table_Data } from "../context/Context_get_table_data.js";
import { Use_Context_current_table_item } from "../context/Context_current_table_item.js";

// STYLE IMPORTS
import "../../../styles/cp_edit.css"

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_edit as Prop_types} from "../Control_panel.js"

import { Types_column_info } from "../context/Context_db_table_info.js";
import { Types_form_data } from "../context/Context_db_table_info.js";

// THE COMPONENT
export default function Control_panel_edit({submit_method}:Prop_types) {
    const section_name = useContext(Use_Context_Section_Name).show_context;
    console.log(`%c SUB-COMPONENT `, `background-color:${log_colors.sub_component}`, `Control_panel_edit for `, section_name);

    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    const current_table_item = useContext(Use_Context_current_table_item).show_context;
    const initial_table_data = useContext(Use_Context_Table_Data).show_context;
    
    const table_data_ref = useRef<Types_form_data[]>(initial_table_data);
    const [status_message, set_status_message] = useState<string>("");


    // ENSURE THE NEW TABLE DATA IS IN A ARRAY FORMAT
    function handle_form_change(form_data:Types_form_data | Types_form_data[]){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data);
        let form_data_array: Types_form_data[] = [];
        if(!Array.isArray(form_data)){
            form_data_array.push(form_data);
            //set_new_table_data(form_data_array);
            table_data_ref.current = form_data_array;
        } else {
            //set_new_table_data(form_data)
            table_data_ref.current = form_data;
        }
    }

    // CHECK TO ENSURE REQUIRED FIELDS ARE NOT LEFT EMPTY BEFORE SUBMITTING
    function check_empty_input(){
        const missing_inputs:string[] = [];
        table_data_ref.current.map((current_entry:Types_form_data)=>{
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
        console.log(`%c THE DATA BEING SENT `, `background-color:${ log_colors.important }`,`for table_data_ref.current`,'\n' ,table_data_ref.current);
        const missing_input = check_empty_input();

        if(missing_input !== ""){
            set_status_message(`Please enter values for ${missing_input}`)
            return
        }
            try {
                const response = await axios.post("/edit_form_data",{
                    table_name: section_name,
                    filter_key: "id",
                    filter_item: current_table_item.id,
                    submit_method: submit_method,
                    db_column_info: db_column_info, 
                    submit_data: table_data_ref.current
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
                            submit_method = {submit_method} 
                            ele_names = {`cp_${section_name}`}
                            send_table_data = {handle_form_change} 
                        /> 
                    </div>
                    :
                    section_name === "employees" 
                    ?
                    <div id="cpe_input_box" className="cp_content_box">
                        <Employee_input 
                            send_table_data = {handle_form_change} 
                        /> 
                    </div>
                    : 
                    <div id="cpe_input_box" className="cp_content_box">
                        <form className="cpe_form">
                        {
                            db_column_info.map((column)=>{
                                return(
                                    <Control_panel_input
                                        key={`input_for_${column.column_name}`}
                                        column_info = {column}
                                        send_table_data = {handle_form_change}
                                    />
                                )
                            })

                        }
                        </form>
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