import axios from "axios";
import { useContext, useEffect, useState } from "react";

// COMPONENT IMPORTS
import Order_shift from "./control_panel_edits/Order_shift.js";
import New_control_panel_entry from "./control_panel_edits/New_control_panel_entry.js";

// CUSTOM HOOKS
import useGetTableData from "./hooks/useGetTableData.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_edit as Prop_types} from "../Control_panel.js"

import { Types_column_info } from "../context/Context_db_table_info.js";
import { Types_form_data } from "../context/Context_db_table_info.js";

// STYLE IMPORTS
import { log_colors } from "../../../styles/log_colors.js";


// THE COMPONENT
export default function Control_panel_edit({submit_method, item_id, section_nav}:Prop_types) {
    
    const section_name = useContext(Use_Context_Section_Name).show_context;

    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    const initial_form_data = useContext(Use_Context_Table_Info).show_context.initial_form_data;

    const table_data = useGetTableData({section_name: section_name, filter_key:"id", filter_item: item_id}); 
    
    const [form_data, set_form_data] = useState<Types_form_data>(initial_form_data);
    const [status_message, set_status_message] = useState<string>("");


    // CHECK TO ENSURE REQUIRED FIELDS ARE NOT LEFT EMPTY BEFORE SUBMITTING
    function check_empty_input(){
        const missing_inputs:string[] = [];
        db_column_info.map((item: Types_column_info) => {
            const null_check = item.is_nullable;
            const current_item = item.column_name;
            if(null_check === "NO" && form_data[current_item] === "" ){
                   missing_inputs.push(current_item);
            }
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
        console.log("the form_data: ", form_data)

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
                    submit_data: form_data
                })
                console.log("The success_message: ",response.data)
                set_status_message(response.data)
                section_nav(section_name);

            } catch (error) {
                console.log('%cError posting info to database: ', 'background-color:darkred',error); 
            }
    }

    useEffect(()=>{
        console.log(`%c SUB-COMPONENT `, `background-color:${log_colors.sub_component}`, `Control_panel_edit`);
    },[])
    
    useEffect(() =>{
        if(submit_method !== "add"){
            set_form_data(table_data[0]);
          };
    },[table_data])

    return (
        <article id="control_panel_edits" className="control_panel_content_box">
            <h3>{submit_method === "add" ? "Add" : "Edit"} {section_name}</h3>
            {
                db_column_info[0].input_type === "order" 
                ? <Order_shift 
                    element_names = {`cp_${section_name}`}
                    send_form_data = {set_form_data} 
                    submit_method = {submit_method}
                /> 
                : form_data && 
                    <New_control_panel_entry 
                        form_data={form_data}
                        send_form_data={set_form_data}
                    />
            }
            
            <button id="client_edit_done" type="button" className="control_panel_btn" onClick={()=>{post_form()}}> Done </button>
            {status_message !== "" &&
                <div>
                    <h3>{status_message}</h3>
                </div>
            }
            
        </article>
    )
}
