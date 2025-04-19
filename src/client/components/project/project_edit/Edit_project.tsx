import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../_universal/inputs/Form_auto_input.js";
import Clients_dd from "../../_universal/drop_downs/Clients_dd.js";
import Pd_input from "./project_departments/Pd_input.js";
import animate_edit_project from "./animations/animate_edit_project.js";

// CONTEXT IMPORTS 
import { Use_Context_project_data } from "../context/Context_project_data.js";
import { Use_Process_input_data } from "../../_universal/Process_input_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/project/edit_project.css"
import "../../../styles/_universal/form_dd.css"

// TYPE DEFINITIONS
import { Types_form_data } from "../../control_panel/context/Context_db_table_info.js";
import { Types_column_info } from "../../control_panel/context/Context_db_table_info.js";
import { Types_data_change } from "../../_universal/Process_input_data.js";
import { Types_input_change } from "../../_universal/inputs/Form_auto_input.js";

interface Types_budget {
    total: number;
    remaining: number;
    percent: number;

}

export interface Types_adjust_budget{
    total?: number;
    used?: number;
}

// THE COMPONENT 
export default function Edit_project() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.component }`, `Edit_project`);

    const initial_form_data = useContext(Use_Context_project_data).show_context.table_info.initial_form_data;
    const db_column_info = useContext(Use_Context_project_data).show_context.table_info.db_column_info;
    const current_project = useContext(Use_Context_project_data).show_context.current_project;

    const update_current_project = useContext(Use_Context_project_data).update_func;
    const process_data = useContext(Use_Process_input_data);
    const animate = animate_edit_project();
    
    const edit_btn_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_input_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_btn_ref = useRef<HTMLButtonElement | null>(null);
    const add_btn_ref = useRef<HTMLButtonElement | null>(null);
    const btn_type = useRef<string>("");

    const [status_message, set_status_message] = useState<string>("");
    const [edit_btn_clicked, set_edit_btn_clicked] = useState<boolean>(false);

    const [production_budget, set_production_budget] = useState<Types_budget>({
        total: 0,
        remaining: 0,
        percent: 0
    })
    const production_budget_ref = useRef<Types_adjust_budget>({
        total: 0,
        used: 0,
    })

    async function handle_edit_project_click({submit_method}:{submit_method?:string} = {}){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for edit_btn_clicked`,'\n' ,edit_btn_clicked);


        if(edit_btn_clicked){
            set_edit_btn_clicked(false)
            process_data.clear_form("projects");
            animate.run_animation({animate_forwards:false})

        } else {
            btn_type.current = submit_method!; 
            set_edit_btn_clicked(true);
            animate.initiate_animation({
                btn_box_ele: edit_btn_box_ref.current!, 
                input_box_ele: edit_input_box_ref.current!, 
                btn_type: submit_method, 
                add_btn_ele: add_btn_ref.current!, 
                edit_btn_ele: edit_btn_ref.current!
            })
            process_data.handle_form_change({section_name:"projects", table_name:"projects", form_data:[current_project.current_table_item]})
        }
        
        if(submit_method && submit_method !== current_project.submit_method){
            console.log(`%c IMPORTANT `, `background-color:${ log_colors.important }`,`for submit_method ${submit_method} and current_project submit_method: ${current_project.submit_method}`);
            const current_project_update = await update_current_project.wait({submit_method:submit_method})
            await update_current_project.update_context(current_project_update)
        }
    }

    function handle_form_change({form_data}:Types_data_change){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data);

        if(!Array.isArray(form_data)){
            if(form_data.db_column === "production_budget"){
                const budget = Number(form_data.input);
                callback_adjust_budget({total:budget});
            }
        } else {
            if( typeof(form_data[0].db_column) === "string"){
                if(form_data[0]["production_budget"]){
                    const budget = Number(form_data[0]["production_budget"]);
                    callback_adjust_budget({total:budget})
          
                }
            }
        }
        process_data.handle_form_change({section_name:"projects", table_name: "projects", form_data: form_data})
    }


    
    const callback_adjust_budget = useCallback(({total, used}:Types_adjust_budget)=>{
        adjust_budget({total ,used})
    },[production_budget.total])


    function adjust_budget({total, used}:Types_adjust_budget){
        let budget:Types_budget ={...production_budget};
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for budget`,'\n' ,budget);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,'\n',`total used: `,production_budget_ref.current.used ,`for used` ,used);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,'\n',`total: `,production_budget_ref.current.total ,`for total` ,total);

        if(used){
            production_budget_ref.current.used =   (production_budget_ref.current.used! + used);
        } else if(total){
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for total`,'\n' ,total);
            production_budget_ref.current.total = total;
        }

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,'\n',`total used: `,production_budget_ref.current.used ,`for used` ,used);

        budget.total = production_budget_ref.current.total! 
        budget.remaining = production_budget_ref.current.total! - production_budget_ref.current.used!

        if(budget.total > 0){
            budget.percent = Number((((budget.total - budget.remaining)/budget.total)*100).toFixed(2));
        } else {
            budget.percent = 100;
        }
            
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for budget`,'\n' ,budget);
        //production_budget_ref.current = budget;
        set_production_budget(budget);
    }

    async function post_form(){
        const response:string = await process_data.post_form({submit_method:current_project.submit_method})
        set_status_message(response)
    }

// MEMOS AND EFFECTS    
    useEffect(() =>{
        handle_form_change({table_name:"projects", form_data:[current_project.current_table_item]})
    },[])

    console.log(`%c DATA `, `background-color:${ log_colors.important }`,`for production_budget`,'\n' ,production_budget);

// RETURNED VALUES 
    return(
        <section id="edit_project_container" >
            <div
                ref = {edit_btn_box_ref}
                className="edit_project_btn_box"
            >

                <button 
                    ref = {add_btn_ref}
                    className="add_project_btn edit_project_btn"
                    onClick={()=>handle_edit_project_click({submit_method:"add"})}
                >
                    <h2>New Project</h2>
                </button>

                <button
                    ref = {edit_btn_ref}
                    className="edit_project_btn edit_project_btn"
                    onClick={()=>handle_edit_project_click({submit_method:"edit"})}
                >
                    <h2>Edit Project</h2>
                </button>
            </div>

            <article
                ref = {edit_input_box_ref} 
                className="edit_project_box general_section box_closed"
            >
            {edit_btn_clicked && 
                <div className="edit_project_input_box">
                    <h2> {current_project.submit_method === "add" ? "New" : "Edit"} Project</h2>
                    <form 
                        className="auto_form"
                    >
                        {db_column_info.map((column:Types_column_info)=>{
                            if(column.column_name.includes("client")){
                                return(
                                    <Clients_dd
                                        key={`input_for_${column.column_name}`}
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
                        className={production_budget.remaining < 0 ? "over_budget" : "under_budget"}
                    >
                        <p>Total Budget: ${production_budget.total}</p>
                        <p>Remaining Budget: ${production_budget.remaining}</p>
                        <p>Budget Used: {production_budget.percent}%</p>
                    </div>

                    <Pd_input 
                        total_production_budget={production_budget.total} 
                        adjust_budget_used={callback_adjust_budget} 
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
                                onClick={()=>handle_edit_project_click()}
                        > 
                        {status_message !== "" ? "Return" : "Cancel"}
                        </button>
                        {status_message !== "" &&
                            <h3>{status_message}</h3>
                        }
                    </div>                    
                </div>
            }
            </article>
        </section>
    ); 
}