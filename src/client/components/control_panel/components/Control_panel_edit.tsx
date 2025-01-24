import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";


// CUSTOM HOOKS
import useGetTableData from "./hooks/useGetTableData.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_edit as Prop_types} from "../control_panel.js"

import { Types_column_info } from "../context/Context_db_table_info.js";
import { Types_form_data } from "../context/Context_db_table_info.js";
import Order_shift from "./control_panel_edits/Order_shift.js";


// THE COMPONENT
export default function Control_panel_edit({submit_method, item_id}:Prop_types) {
    
    const section_name = useContext(Use_Context_Section_Name).show_context;

    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    const initial_form_data = useContext(Use_Context_Table_Info).show_context.initial_form_data;

    const table_data = useGetTableData({section_name: section_name, filter_name:"id", filter_item: item_id, }); 
    

    const [form_data, set_form_data] = useState<Types_form_data>(initial_form_data);
    const [status_message, set_status_message] = useState<string>("");


    // CREATE THE INPUTS FOR THE FORM BASED ON DATABASE COLUMN NAMES
    function create_inputs(item: Types_column_info, index:number) {
        const item_name:string = item.column_name;
        const input_type = item.input_type;
        const item_string = item_name.replace("_"," ");
        const form_value = form_data[item_name] ? form_data[item_name] : "";
        return(
            <div className="cpe_form_input"  key={index}>
                <p>{item_string}</p>
                <input
                type={input_type}
                placeholder={item_string}
                value={form_value}
                name={item_name}
                onChange={(e)=>{set_form_data({...form_data, [item_name]: e.target.value})}}
                // for range inputs
                min="1"
                max="2"

                />
                <p>{input_type === "range" &&
                    form_data[item_name]
                    }
                </p>
            </div>
        )
    }

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
                    filter_name: "id",
                    filter_item: item_id,
                    submit_method: submit_method,
                    db_column_info: db_column_info, 
                    submit_data: form_data
                })
                console.log("The success_message: ",response.data)

            } catch (error) {
                console.log('%cError posting info to database: ', 'background-color:darkred',error); 
            }
    }


    useEffect(()=>{
        console.log(`%cControl_panel_edit Called for ${section_name}`, 'background-color:darkorchid');
    },[])
    
    useEffect(() =>{
        if(submit_method !== "add"){
            set_form_data(table_data[0]);
          };
    },[table_data])

    return (
        <figure>
            <form id="cpe_form">
            {
            section_name === "departments" ? <Order_shift element_names = "cp_departments" /> : form_data && db_column_info.map(create_inputs)
            }
            <button id="client_edit_done" type="button" className="control_panel_btn" onClick={()=>{post_form()}}> Done </button>
            </form>
            {status_message !== "" &&
                <div>
                    <h3>{status_message}</h3>
                </div>
            }
            
        </figure>
    )
}
