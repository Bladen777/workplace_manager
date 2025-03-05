import { useContext, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 
import { Use_Context_project } from "./context/Context_projects.js";
// HOOK IMPORTS 

// STYLE IMPORTS
import "../../styles/new_project.css"

// LOG STYLE 
import { log_colors } from "../../styles/_log_colors.js";


// TYPE DEFINITIONS

// THE COMPONENT 
export default function New_project() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.component }`, `New_project`);

    const initial_form_data = useContext(Use_Context_project).show_context.table_info.initial_form_data;
    const db_column_info = useContext(Use_Context_project).show_context.table_info.db_column_info;

    //const update_current_project = useContext(Use_Context_project).update_func;

    const [new_btn_clicked, set_new_btn_clicked] = useState<boolean | null>(null);

    function handle_new_project_click(){
        if(new_btn_clicked === null){
            set_new_btn_clicked(true);
        } else {
            set_new_btn_clicked(!new_btn_clicked)
        }
    }
    
    // FORM INFO CHANGED
    function handle_form_change(){

    }

    // RETURNED VALUES 
    return(
        <section id="new_project_box" >
            <button 
                key={Math.random()}
                className={
                    new_btn_clicked ? "new_project_btn_close new_project_btn" : 
                    new_btn_clicked === false ? "new_project_btn_open new_project_btn" :
                    "new_project_btn"
                }
                onClick={handle_new_project_click}
            >
                <h2>New Project</h2>
            </button>
            
            <div
                key={Math.random()}
                className={
                    new_btn_clicked ? "new_project_input_box_open new_project_input_box general_section" : 
                    new_btn_clicked === false ? "new_project_input_box_close new_project_input_box general_section" :
                    "new_project_input_box"
                }
            >
                <h2> New Project</h2>
                <form className="cpe_form">
                    {   
                    
                        db_column_info.map((column)=>{
                            console.log(`%c DATA `, `background-color:${ log_colors.important }`,`for db_column_info`,'\n' ,db_column_info);
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
              


                <button 
                    className="new_project_done_btn"
                    onClick={handle_new_project_click}
                >
                    <h3>Done</h3>    
                </button>                    

            </div>
        </section>
    ); 
}