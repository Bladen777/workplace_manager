import { useContext, useRef, useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 
import { Use_Context_project } from "../../context/Context_projects.js";
// HOOK IMPORTS 

// STYLE IMPORTS
import "../../../../styles/project/edit_project.css"

// LOG STYLE 
import { log_colors } from "../../../../styles/_log_colors.js";


// TYPE DEFINITIONS
import { Types_form_data } from "../../../control_panel/context/Context_db_table_info.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";
import { Types_column_info } from "../../../control_panel/context/Context_db_table_info.js";


// THE COMPONENT 
export default function Edit_project() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.component }`, `New_project`);

    const initial_form_data = useContext(Use_Context_project).show_context.table_info.initial_form_data;
    const db_column_info = useContext(Use_Context_project).show_context.table_info.db_column_info;
    const current_project = useContext(Use_Context_project).show_context.current_project;

    //const update_current_project = useContext(Use_Context_project).update_func;


    const submit_method = "add";

    let starting_data: Types_form_data[] = [current_project];
    if(submit_method === "add"){
        starting_data = [initial_form_data] 
    } 
    const table_data_ref = useRef<Types_form_data[]>(starting_data);
    const [status_message, set_status_message] = useState<string>("");

    const [edit_btn_clicked, set_edit_btn_clicked] = useState<boolean | null>(null);

    function handle_edit_project_click(){
        if(edit_btn_clicked === null){
            set_edit_btn_clicked(true);
        } else {
            set_edit_btn_clicked(!edit_btn_clicked)
        }
    }
    
    // FORM INFO CHANGED
    function handle_form_change(form_data:Types_input_change | Types_form_data[]){
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data);
            let form_data_array: Types_form_data[] = [];  
            if(!Array.isArray(form_data)){
                const update_form_data = {...table_data_ref.current[0], [form_data.db_column]:form_data.input};
                form_data_array.push(update_form_data);
                table_data_ref.current = form_data_array;
            } else {
                table_data_ref.current = form_data;
            }
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for table_data_ref.current`,'\n' ,table_data_ref.current);
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
                    table_name: "projects",
                    filter_key: "id",
                    filter_item: current_project.id,
                    submit_method: submit_method,
                    db_column_info: db_column_info, 
                    submit_data: table_data_ref.current
                })
  

                console.log("The success_message: ",response.data);
                set_status_message(response.data);
                handle_edit_project_click()

            } catch (error) {
                console.log('%cError posting info to database: ', 'background-color:darkred',error); 
            }
    }

    // RETURNED VALUES 
    return(
        <section id="edit_project_box" >
            <button 
                key={Math.random()}
                className={
                    edit_btn_clicked ? "edit_project_btn_close edit_project_btn" : 
                    edit_btn_clicked === false ? "edit_project_btn_open edit_project_btn" :
                    "edit_project_btn"
                }
                onClick={handle_edit_project_click}
            >
                <h2>New Project</h2>
            </button>
            
            <div
                key={Math.random()}
                className={
                    edit_btn_clicked ? "edit_project_input_box_open edit_project_input_box general_section" : 
                    edit_btn_clicked === false ? "edit_project_input_box_close edit_project_input_box general_section" :
                    "edit_project_input_box"
                }
            >
                <h2> New Project</h2>
                <form 
                    id="edit_project_form"
                    className="auto_form"
                >
                    {   
                    
                        db_column_info.map((column)=>{
                            return(
                                <Form_auto_input
                                    key={`input_for_${column.column_name}`}
                                    column_info = {column}
                                    table_data_object={initial_form_data}
                                    send_table_data = {handle_form_change}
                                />
                            )
                        })

                    }
                </form>
              


                <div className="edit_project_utility_bar">
                    <button id="edit_project_done_btn" type="button"
                            className="general_btn"
                            onClick={post_form}
                    >
                        Done  
                    </button>
                    <button id="edit_project_cancel_btn" type="button" 
                            className="general_btn" 
                            onClick={handle_edit_project_click}> {status_message !== "" ? "Return" : "Cancel"}
                    </button>
                    {status_message !== "" &&
                        <h3>{status_message}</h3>
                    }
                </div>                    

            </div>
        </section>
    ); 
}