import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../_universal/inputs/Form_auto_input.js";
import Clients_dd from "../../_universal/drop_downs/Clients_dd.js";
import Pd_input from "./project_departments/Pd_input.js";
import Animate_edit_project from "./animations/Animate_edit_project.js";

// CONTEXT IMPORTS 

import { Use_Context_initial_data } from "../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../../_universal/Process_input_data.js";
import { Use_Context_project_budgets } from "../context/Context_project_budgets.js";
import { Use_Context_departments_data } from "../../context/Context_departments_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/project_edit/edit_project.css";
import "../../../styles/_universal/form_dd.css"

// TYPE DEFINITIONS
import { Types_form_data } from "../../context/Context_initial_data.js";
import { Types_update_data } from "../../_universal/Process_input_data.js";
import { Types_input_change } from "../../_universal/inputs/Form_auto_input.js";
import { Types_column_info } from "../../context/Context_initial_data.js";

import { Types_department_budgets } from "../context/Context_project_budgets.js";
import { Types_department_data } from "../../context/Context_departments_data.js";


interface Types_budget {
    remaining: number;
    percent: number;
}

export interface Types_project_dates {
    [key:string]: string | undefined;
    start_date: string | undefined;
    finish_date: string | undefined;
}

export interface Types_adjust_budget{
    total?: number;
    used?: number;
}

// THE COMPONENT 
export default function Edit_project() {
    console.log(`%c COMPONENT `, `${ log_colors.component }`, `Edit_project`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const process_data = useContext(Use_Process_input_data);

    const departments = useContext(Use_Context_departments_data).show_context;
    const project_budgets = useContext(Use_Context_project_budgets).show_context;
    const update_project_budgets = useContext(Use_Context_project_budgets).update_func;

    const update_initial_data = useContext(Use_Context_initial_data).update_func;
    const update_active_entry = useContext(Use_Context_active_entry).update_func;

    const [project_initial_form_data, set_project_initial_form_data] = useState<Types_form_data>({})

    const [status_message, set_status_message] = useState<string>("");
    const [edit_btn_clicked, set_edit_btn_clicked] = useState<boolean>(false);
    const [project_dates, set_project_dates] = useState<Types_project_dates>({
        start_date: undefined,
        finish_date: undefined
    })

    const [production_budget, set_production_budget] = useState<Types_budget>({
        remaining: 0,
        percent: 0
    })

    // CONSTS FOR ANIMATING
    const animate = Animate_edit_project();
    const edit_btn_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_input_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_btn_ref = useRef<HTMLButtonElement | null>(null);
    const add_btn_ref = useRef<HTMLButtonElement | null>(null);
    const btn_type = useRef<string>("");


    async function handle_edit_project_click({submit_method}:{submit_method?:string} = {}){ 
        if(submit_method){
            await adjust_initial_data({submit_method:submit_method});
        }
        
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
        }
        set_status_message("");   
    }


    async function adjust_initial_data({submit_method}:{submit_method?:string} = {}){
        let project_budgets_update = {};
        let project_initial_form_data_update = initial_data["projects"].info.form_data;

        if(submit_method === "edit"){
            process_data.update_data({table_name: "projects", form_data: initial_data["projects"].data})
            process_data.update_data({table_name: "project_department_budgets", form_data: initial_data["project_department_budgets"].data})
            process_data.update_data({table_name: "employee_budgets", form_data: initial_data["employee_budgets"].data})
            
            const department_budgets:Types_department_budgets = {};
            let budget_used:number = 0;
            initial_data["project_department_budgets"].data.forEach((entry)=>{

                department_budgets[`dep_id_${entry.department_id}`] = Number(entry.budget);
                budget_used += Number(entry.budget);
            })
            console.log(`%c DATA `, `${ log_colors.important }`,`for budget_used`,'\n' ,budget_used);

            project_budgets_update = await update_project_budgets.wait({all_budgets:{
                total:Number(initial_data["projects"].data[0].production_budget),
                used:budget_used,
                departments: department_budgets
            }})
            project_initial_form_data_update = initial_data["projects"].data[0];

        } else {
            const date = new Date().toISOString().slice(0,10);
            let new_project_data = {...project_initial_form_data, date_added:date}
            process_data.update_data({table_name: "projects", form_data: [new_project_data]})

            const department_budgets:Types_department_budgets = {};
            initial_data["project_department_budgets"].data.forEach((entry)=>{
                department_budgets[`dep_id_${entry.department_id}`] = 0;
            })

            project_budgets_update = await update_project_budgets.wait({all_budgets:{
                total:0,
                used:0,
                departments: department_budgets
            }})

            const department_budget_data = departments.map((item:Types_department_data)=>{
                return{
                    department_id: item.id,
                    project_id: -1,
                    start_date: undefined,
                    finish_date: undefined,
                    budget: 0
                }
            })
            process_data.update_data({table_name: "project_department_budgets", form_data:department_budget_data}) 
        }

        if(submit_method && submit_method !== active_entry.submit_method){
            const active_entry_update = await update_active_entry.wait({submit_method:submit_method});
            update_active_entry.update_context(active_entry_update);
            
        }
        await update_project_budgets.update_context(project_budgets_update);
        console.log(`%c UPDATE EDIT PROJECT NOW `, `${ log_colors.important }`);
        set_project_dates({
            start_date: typeof(project_initial_form_data_update.start_date) !== "number" ? project_initial_form_data_update.start_date : undefined,
            finish_date: typeof(project_initial_form_data_update.finish_date) !== "number" ? project_initial_form_data_update.finish_date : undefined
        })
        set_project_initial_form_data(project_initial_form_data_update);
    }

    function handle_form_change({form_data}:Types_update_data){
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
        process_data.update_data({section_name:"projects", table_name: "projects", form_data: form_data})
    }
    

    const callback_adjust_budget = useCallback(({total}:Types_adjust_budget)=>{
        update_project_budgets.now({total:true, budget:total})
    },[])

    const callback_handle_project_date_change = useCallback(({ input, db_column}:Types_input_change) =>{
            handle_project_date_change({ input, db_column})
        },[])
    
    function handle_project_date_change({input, db_column}:Types_input_change){
        set_project_dates((prev_vals)=>{
            let date_type = db_column.includes("finish") ? "finish_date" :"start_date";
            const update_dates = {...prev_vals, [date_type]:input}
            process_data.update_data({table_name: "projects", form_data: {input:input ,db_column:db_column}})
            return update_dates;  
        })
    }

    async function update_project_data({project_id}:{project_id:number}){

        const active_entry_update = await update_active_entry.wait({target_id:project_id});
        await update_initial_data.wait({table_name: "project_department_budgets", entry_id_key:"project_id" ,entry_id:project_id});
        await update_initial_data.wait({table_name: "employee_budgets", entry_id_key:"project_id" ,entry_id:project_id});
        await update_initial_data.now({table_name: "projects", entry_id_key:"id" ,entry_id:project_id});
        update_active_entry.update_context(active_entry_update);

      }

    async function post_form(){
        const response:{message:string, entry_id:number} = await process_data.post_data({
            submit_method:active_entry.submit_method, 
            display_entry_id: (active_entry.submit_method === "edit" ? initial_data["projects"].data[0].id : 0)
        })
        console.log(`%c POST FORM FOR PROJECTS `, `${ log_colors.important_2 }`,`for response`,'\n' ,response);
        if(response.message.includes("successfully")){
            update_project_data({project_id:response.entry_id})
        }
        set_status_message(response.message);
    }

    const create_pd_input = useCallback((item:Types_department_data)=>{
        return(
            <Pd_input
            key={`pd_input_${item.name}`}
            project_dates = {project_dates}
            dep_data = {item}
        />
        )
    },[project_dates])

// MEMOS AND EFFECTS    

    useEffect(()=>{
        if(initial_data["projects"]){
            set_production_budget((prev_vals)=>{
                let budget:Types_budget ={...prev_vals};
                budget.remaining = project_budgets.total - project_budgets.used;
    
                if(project_budgets.total > 0){
                    budget.percent = Number((((project_budgets.total - budget.remaining)/project_budgets.total)*100).toFixed(2));
                } else {
                    budget.percent = 100;
                }
                return budget
            })
        } 
        console.log(`%c PROJECT BUDGETS CHANGED `, `${ log_colors.data }`);
    },[project_budgets])

    
/*
    useMemo(()=>{
        //update_current_project.now({current_project_id:10})
        if(project_initial_form_data && Object.keys(project_initial_form_data).length < 1){
            adjust_initial_data({submit_method:"add"});
        }
    },[active_entry.target_id])
*/

/*
    useMemo(() =>{
        departments && create_pd_inputs()
    },[departments])
*/

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
                {active_entry.target_id !== 0 && 
                <button
                    ref = {edit_btn_ref}
                    className="edit_project_btn edit_project_btn"
                    onClick={()=>handle_edit_project_click({submit_method:"edit"})}
                >
                    <h2>Edit Project</h2>
                </button>
                }
            </div>

            <article
                id="edit_project_input_box"
                ref = {edit_input_box_ref} 
                className="edit_project_box general_section box_closed"
            >
                {edit_btn_clicked && 
                    <div className="edit_project_input_box">
                        <h2> {active_entry.submit_method === "add" ? "New" : "Edit"} Project</h2>
                        
                        <form className="auto_form" id="project_input_form">
                            {initial_data["projects"].info.db_column_info.map((column:Types_column_info)=>{
                                if(column.column_name.includes("client")){
                                    return(
                                        <Clients_dd
                                            key={`input_for_${column.column_name}`}
                                        />
                                    )
                                } else if(
                                    !column.column_name.includes("start_date") 
                                    && !column.column_name.includes("finish_date") 
                                    && !column.column_name.includes("date_added") 
                                ){
                                    return(
                                        <Form_auto_input
                                            key={`input_for_${column.column_name}`}
                                            column_info = {column}
                                            initial_data_object={project_initial_form_data}
                                            adjust_data_object={active_entry.submit_method === "edit" ? project_initial_form_data : project_initial_form_data}
                                            send_table_data = {(form_data:Types_input_change)=>{handle_form_change({table_name: "projects", form_data:form_data})}}
                                        />
                                    )
                                }
                            })}
                        </form>
                        <form className="auto_form" id="edit_project_employee_select_box">
                            <h3>Department Budgets</h3>
                            <div className="project_dates">
                                <Form_auto_input
                                    column_info = {{
                                        column_name: "start_date",
                                        is_nullable: "YES",
                                        input_type: "date"
                                    }}
                                    label_name="Project Start Date"
                                    initial_data_object={project_initial_form_data}
                                    send_table_data = {callback_handle_project_date_change}
                                />
                                <Form_auto_input
                                    column_info = {{
                                        column_name: "finish_date",
                                        is_nullable: "YES",
                                        input_type: "date"
                                    }}
                                    label_name="Project Finish Date"
                                    initial_data_object={project_initial_form_data}
                                    send_table_data = {callback_handle_project_date_change}
                                />
                            </div>

                            {/* departments && pd_inputs */}
                            {departments.map((item:Types_department_data)=>
                                create_pd_input(item)
                            )}

                        </form>
                        <div className="edit_project_utility_bar">
                            <div className="utility_bar_buttons">
                                <button id="edit_project_done_btn" type="button"
                                        className="general_btn"
                                        onClick={post_form}
                                >
                                    <h4>Save</h4>  
                                </button>
                                <button id="edit_project_cancel_btn" type="button" 
                                        className="general_btn" 
                                        onClick={()=>handle_edit_project_click()}
                                > 
                                    <h4>{status_message !== "" ? "Return" : "Cancel"}</h4>
                                </button>
                                {status_message !== "" &&
                                    <h3 className="status_message">{status_message}</h3>
                                }
                            </div>
                            <div 
                                id="project_budget_tracker"      
                                className={production_budget.remaining < 0 ? "over_budget" : "under_budget"}
                            >
                                <p>Total Budget: ${project_budgets.total.toFixed(2)}</p>
                                <p>Remaining Budget: ${production_budget.remaining.toFixed(2)}</p>
                                <p>Budget Used: {production_budget.percent}%</p>
                            </div>
                        </div> 
                    </div>  
                }
            </article>
            
        </section>
    ); 
}