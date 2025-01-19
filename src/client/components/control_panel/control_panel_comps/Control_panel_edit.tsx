import axios from "axios";
import { useEffect, useState } from "react";


// CUSTOM HOOKS
import useDBTableColumns from "./hooks/useDBTableColumns.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_edit as Prop_types} from "../Control_panel.js"

import { Types_column_info } from "./hooks/useDBTableColumns.js";
import { Types_form_data } from "./hooks/useDBTableColumns.js";


// THE COMPONENT
export default function Control_panel_edit({submit_method, item_id, section_name}:Prop_types) {
    console.log('%cControl_panel_edit Called', 'background-color:darkorchid',);

    const get_initial_info = useDBTableColumns(section_name);
    
    const [db_column_info, set_db_column_info] = useState<Types_column_info[]>([]);
    const [form_data, set_form_data] = useState<Types_form_data>({});
    const [status_message, set_status_message] = useState<string>("");


    // INITIAL FUNCTION TO GATHER THE DATA FROM DATABASE REQUIRED TO CREATE FORMS
    async function get_db_columns() {
        set_form_data(get_initial_info.initial_form_data);
        set_db_column_info(get_initial_info.db_column_info);
    }

    // GET EXISTING FORM INFORMATION FROM THE DATABASE AND ADD IT TO THE FORM
    async function get_form_info(){
        try {
            const response = await axios.post("/get_table_info",{
                table_name: section_name,
                filter_name: "id",
                filter_item: item_id
            })
            const data = response.data[0];
            console.log("the existing data: ", data);
            console.log("the current db_column_info: ", db_column_info);
            console.log("the current form_data: ", form_data );

            db_column_info.map((item:Types_column_info) => {
                const column_name = item.column_name;
                let data_value = data[column_name];
               
                if(data[column_name]){
                    if(column_name.includes("date")){
                        data_value = `${data_value.slice(0,10)}`;
                    };
                    console.log("the current column: ", column_name, "\n",  
                                "the current item: ", data_value);
                    set_form_data(prev_state => {
                        return{
                        ...prev_state,
                        [column_name]: data_value
                        }
                    });
                }
            });
            
        } catch (error) {
            console.log('%cError getting existing info: ', 'background-color:darkred',error); 
        }
    }

    // GET THE INFOMATION FOR SETTING A RANGE INPUT 
    async function get_table_range(item_name:string){
        try {
            const response = await axios.post("/get_table_info", {
                table_name: section_name,
                sort_field: item_name
                }
            )
            const data:number = response.data.length + 1;
            console.log("the table range: ", data)
            return data
        } catch (error) {
            console.log('%cError getting table range: ', 'background-color:darkred',error);
        }  
    }

    // CREATE THE INPUTS FOR THE FORM BASED ON DATABASE COLUMN NAMES
    function create_inputs(item: Types_column_info, index:number) {
        const item_name:string = item.column_name;
        const input_type = item.input_type;
        const item_string = item_name.replace("_"," ");
        return(
            <div className="cpe_form_input"  key={index}>
                <p>{item_string}</p>
                <input
                type={input_type}
                placeholder={item_string}
                value={form_data[item_name]}
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
        get_db_columns();
    },[get_initial_info])
    

    useEffect(() =>{
        if(submit_method !== "add"){
            get_form_info();
          };
    },[db_column_info])

    return (
        <figure>
            <form id="cpe_form">
            {db_column_info.map(create_inputs)}
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
