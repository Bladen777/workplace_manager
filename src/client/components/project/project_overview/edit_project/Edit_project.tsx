import { useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";
import Process_input_data from "../../../_universal/Process_input_data.js";

// CONTEXT IMPORTS 
import { Use_Context_project } from "../../context/Context_projects.js";
// HOOK IMPORTS 

// STYLE IMPORTS
import "../../../../styles/project/edit_project.css"

// LOG STYLE 
import { log_colors } from "../../../../styles/_log_colors.js";


// TYPE DEFINITIONS
import { Types_form_data } from "../../../control_panel/context/Context_db_table_info.js";
import { Types_data_change } from "../../../_universal/Process_input_data.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";


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

    const [status_message, set_status_message] = useState<string>("");
    const [edit_btn_clicked, set_edit_btn_clicked] = useState<boolean | null>(null);

    function handle_edit_project_click(){
        if(edit_btn_clicked === null){
            set_edit_btn_clicked(true);
        } else {
            set_edit_btn_clicked(!edit_btn_clicked)
        }
    }

    const process_data = Process_input_data()

    function handle_form_change({form_data}:Types_data_change){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data);
        process_data.handle_form_change({table_name: "Projects", form_data: form_data})
    }

    async function post_form(){
        const response:string = await process_data.post_form({submit_method:submit_method})
        set_status_message(response)
    }

    useEffect(() =>{
        handle_form_change({table_name:"projects", form_data:starting_data})
        },[])



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
                    className="auto_form"
                >
                    {   
                        db_column_info.map((column)=>{
                            return(
                                <Form_auto_input
                                    key={`input_for_${column.column_name}`}
                                    column_info = {column}
                                    table_data_object={initial_form_data}
                                    send_table_data = {(form_data:Types_input_change)=>{handle_form_change({form_data:form_data})}}
                                />
                            )
                        })

                    }
                </form>

                <form>



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