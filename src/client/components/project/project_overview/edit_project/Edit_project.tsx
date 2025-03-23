import { useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";
import Process_input_data from "../../../_universal/Process_input_data.js";
import Clients_dd from "../../../_universal/drop_downs/Clients_dd.js";
import Pd_input from "./project_departments/Pd_input.js";

// CONTEXT IMPORTS 
import { Use_Context_project } from "../../context/Context_projects.js";

// HOOK IMPORTS 

// STYLE IMPORTS
import "../../../../styles/project/edit_project.css"

// LOG STYLE 
import { log_colors } from "../../../../styles/_log_colors.js";


// TYPE DEFINITIONS
import { Types_form_data } from "../../../control_panel/context/Context_db_table_info.js";
import { Types_column_info } from "../../../control_panel/context/Context_db_table_info.js";
import { Types_data_change } from "../../../_universal/Process_input_data.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";


interface Types_project_keys {
    btn_key: number;
    input_box_key: number;
}




// THE COMPONENT 
export default function Edit_project() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.component }`, `Edit_project`);

    const initial_form_data = useContext(Use_Context_project).show_context.table_info.initial_form_data;
    const db_column_info = useContext(Use_Context_project).show_context.table_info.db_column_info;
    const current_project = useContext(Use_Context_project).show_context.current_project;


    const process_data = Process_input_data();
    
    //const update_current_project = useContext(Use_Context_project).update_func;

    const submit_method = "add";

    let starting_data: Types_form_data[] = [current_project];
    if(submit_method === "add"){
        starting_data = [initial_form_data] 
    } 

    const [status_message, set_status_message] = useState<string>("");
    const [edit_btn_clicked, set_edit_btn_clicked] = useState<boolean | null>(null);
    const [edit_project_keys, set_edit_project_keys] = useState<Types_project_keys>({
        btn_key: 1,
        input_box_key:2
    })
    const [production_budget, set_production_budget] = useState<number>(0)
    const [budget_used, set_budget_used] = useState<number>(0);

    function handle_edit_project_click(){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for edit_btn_clicked`,'\n' ,edit_btn_clicked);
        if(edit_btn_clicked === null){
            set_edit_btn_clicked(true);
        } else {
            set_edit_btn_clicked(!edit_btn_clicked)
        }
        const new_key = Math.random();
        set_edit_project_keys({
            btn_key: new_key,
            input_box_key: new_key + 1
        })
    }

    

    function handle_form_change({form_data}:Types_data_change){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data);

        if(!Array.isArray(form_data)){
            if(form_data.db_column === "production_budget"){
                console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data.input`,'\n' ,form_data.input);
                set_production_budget(Number(form_data.input))
            }
        } else {
            if( typeof(form_data[0].db_column) === "string"){
                if(form_data[0]["prodction_budget"]){
                    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data[0][production_budget]`,'\n' ,form_data[0][production_budget]);
                    set_production_budget(Number(form_data[0]["production_budget"]));
                }
            }
        }
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
        <section id="edit_project_container" >
            <button 
                key={edit_project_keys.btn_key}
                className={
                    edit_btn_clicked ? "edit_project_btn_close edit_project_btn" : 
                    edit_btn_clicked === false ? "edit_project_btn_open edit_project_btn" :
                    "edit_project_btn"
                }
                onClick={handle_edit_project_click}
            >
                <h2>New Project</h2>
            </button>
            
            <article 
                key={edit_project_keys.input_box_key}
                className={
                    edit_btn_clicked ? "edit_project_box_open general_section edit_project_box" : 
                    edit_btn_clicked === false ? "edit_project_box_close general_section edit_project_box" :
                    "edit_project_box"
                }>
                <div className="edit_project_input_box">
                    <h2> New Project</h2>
                    <form 
                        className="auto_form"
                    >
                        {edit_btn_clicked && db_column_info.map((column:Types_column_info)=>{
                            if(column.column_name.includes("client")){
                                return(
                                    <Clients_dd
                                        key={`input_for_${column.column_name}`}
                                        send_table_data = {(form_data:Types_input_change)=>{handle_form_change({form_data:form_data})}}
                                    />
                                )
                            } else if(column.column_name.includes("budget")){
                                return(
                                    <Form_auto_input
                                        key={`input_for_${column.column_name}`}
                                        column_info = {column}
                                        table_data_object={initial_form_data}
                                        send_table_data = {(form_data:Types_input_change)=>{handle_form_change({form_data:form_data})}}
                                    />
                                )



                            } else {
                                return(
                                    <Form_auto_input
                                        key={`input_for_${column.column_name}`}
                                        column_info = {column}
                                        table_data_object={initial_form_data}
                                        send_table_data = {(form_data:Types_input_change)=>{handle_form_change({form_data:form_data})}}
                                    />
                                )
                            }
                        })}
                    </form>
                    <div 
                        id="project_budget_tracker"      
                        className={budget_used > production_budget ? "over_budget" : "under_budget"}
                    >
                        <p>Total Budget: ${production_budget}</p>
                        <p>Remaining Budget: ${(production_budget - budget_used).toFixed(2)}</p>
                        <p>Remaining Budget: %{(((production_budget - budget_used)/production_budget)*100).toFixed(2)}</p>
                    </div>

                    <Pd_input 
                        total_production_budget={production_budget} 
                        edit_btn_clicked={edit_btn_clicked}
                        adjust_budget_used={(value:number) => {set_budget_used(budget_used + value)}} 
                    />

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
            </article>
        </section>
    ); 
}