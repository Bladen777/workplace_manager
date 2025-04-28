import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../_universal/inputs/Form_auto_input.js";
import Clients_dd from "../../_universal/drop_downs/Clients_dd.js";
import Pd_input from "./project_departments/Pd_input.js";
import animate_edit_project from "./animations/animate_edit_project.js";

// CONTEXT IMPORTS 
import { Use_Context_project_data } from "../context/Context_project_data.js";
import { Use_Process_input_data } from "../../_universal/Process_input_data.js";
import { Use_Context_project_budgets } from "../context/Context_project_budgets.js";

import { Use_Context_departments_data } from "../../context/Context_departments_data.js";
import { Provide_Context_employee_data } from "./project_departments/employee_dd/context/Context_employee_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/project/edit_project.css"
import "../../../styles/_universal/form_dd.css"

// TYPE DEFINITIONS
import { Types_column_info } from "../../control_panel/context/Context_db_table_info.js";
import { Types_data_change } from "../../_universal/Process_input_data.js";
import { Types_input_change } from "../../_universal/inputs/Form_auto_input.js";

import { Types_department_budgets } from "../context/Context_project_budgets.js";
import { Types_department_data } from "../../context/Context_departments_data.js";
import { finished } from "stream";



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

    const existing_project_data = useContext(Use_Context_project_data).show_context
    const project_initial_form_data = existing_project_data.table_info.projects.initial_form_data;
    const db_column_info = existing_project_data.table_info.projects.db_column_info;
    const current_project = existing_project_data.current_project;
    const project_submit_method = existing_project_data.submit_method;

    const departments = useContext(Use_Context_departments_data).show_context;
    const project_budgets = useContext(Use_Context_project_budgets).show_context;

    const update_current_project = useContext(Use_Context_project_data).update_func;
    const update_project_budgets = useContext(Use_Context_project_budgets).update_func;
    const process_data = useContext(Use_Process_input_data);

    const [status_message, set_status_message] = useState<string>("");
    const [edit_btn_clicked, set_edit_btn_clicked] = useState<boolean>(false);
    const [project_dates, set_project_dates] = useState<Types_project_dates>({
        start_date:undefined,
        finish_date: undefined
    })

    //const [pd_inputs, set_pd_inputs] = useState<ReactElement[]>([]);

    const [production_budget, set_production_budget] = useState<Types_budget>({
        remaining: 0,
        percent: 0
    })

    // consts for animating
    const animate = animate_edit_project();
    const edit_btn_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_input_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_btn_ref = useRef<HTMLButtonElement | null>(null);
    const add_btn_ref = useRef<HTMLButtonElement | null>(null);
    const btn_type = useRef<string>("");

    

    async function handle_edit_project_click({submit_method}:{submit_method?:string} = {}){
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
        
        if(submit_method && submit_method !== existing_project_data.submit_method){
            const current_project_update = await update_current_project.wait({submit_method:submit_method})
            await update_current_project.update_context(current_project_update)
        }

        adjust_initial_data({submit_method:submit_method});
    }

    function adjust_initial_data({submit_method}:{submit_method?:string} = {}){
        if(submit_method === "edit"){
            process_data.handle_form_change({section_name:"projects", table_name: "projects", form_data: [current_project.project_data]})
            process_data.handle_form_change({section_name:"projects", table_name: "project_department_budgets", form_data: current_project.project_department_budgets})
            process_data.handle_form_change({section_name:"projects", table_name: "employee_budgets", form_data: current_project.employee_budgets})
            

            const department_budgets:Types_department_budgets = {};
            let budget_used:number = 0;
            current_project.project_department_budgets.forEach((entry)=>{

                department_budgets[`dep_id_${entry.department_id}`] = Number(entry.budget);
                budget_used += Number(entry.budget);
            })
            console.log(`%c DATA `, `${ log_colors.important }`,`for budget_used`,'\n' ,budget_used);
            update_project_budgets.now({all_budgets:{
                total:Number(current_project.project_data.production_budget),
                used:budget_used,
                departments: department_budgets
            }})
        
        } else {
            const date = new Date().toISOString().slice(0,10);
            let new_project_data = {...project_initial_form_data, date_added:date}
            process_data.handle_form_change({section_name:"projects", table_name: "projects", form_data: [new_project_data]})

            const department_budget_data = departments.map((item:Types_department_data)=>{
                return{
                    department_id: item.id,
                    project_id: -1,
                    start_date: undefined,
                    finish_date: undefined,
                    budget: 0
                }
            })
            process_data.handle_form_change({section_name:"projects", table_name: "project_department_budgets", form_data:department_budget_data}) 
        } 
    }

    function handle_form_change({form_data}:Types_data_change){
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
    

    const callback_adjust_budget = useCallback(({total}:Types_adjust_budget)=>{
        update_project_budgets.now({total:true, budget:total})
    },[])


    function adjust_budget(){
        let budget:Types_budget ={...production_budget};
        budget.remaining = project_budgets.total - project_budgets.used;

        if(project_budgets.total > 0){
            budget.percent = Number((((project_budgets.total - budget.remaining)/project_budgets.total)*100).toFixed(2));
        } else {
            budget.percent = 100;
        }
        set_production_budget(budget);
    }

    const callback_handle_project_date_change = useCallback(({ input, db_column}:Types_input_change) =>{
            handle_project_date_change({ input, db_column})
        },[])
    
    function handle_project_date_change({input, db_column}:Types_input_change){
        set_project_dates((prev_vals)=>{
            let date_type = db_column.includes("finish") ? "finish_date" :"start_date";
            const update_dates = {...prev_vals, [date_type]:input}
            return update_dates;  
        })
    }
    async function post_form(){
        const response:string = await process_data.post_form({section_name:"projects", submit_method:existing_project_data.submit_method})
        set_status_message(response)
    }

/*
    function create_pd_inputs(){
        const inputs = departments.map((item)=>
            <Pd_input
                key={`pd_input_${item.name}`}
                dep_data = {item}
            />
        )
        set_pd_inputs(inputs)
    }
*/

// MEMOS AND EFFECTS    

    useMemo(()=>{
        adjust_budget()
    },[project_budgets])
    
    useMemo(()=>{
        //update_current_project.now({current_project_id:10})
        if(current_project.project_data && Object.keys(current_project.project_data).length < 1){
            adjust_initial_data({submit_method:"add"});
        }
    },[])

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
                {current_project.project_data && Object.keys(current_project.project_data).length > 0 &&
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
                    <h2> {existing_project_data.submit_method === "add" ? "New" : "Edit"} Project</h2>
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
                                        adjust_data_object={project_submit_method === "edit" ? current_project.project_data : project_initial_form_data}
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
                        <p>Total Budget: ${project_budgets.total.toFixed(2)}</p>
                        <p>Remaining Budget: ${production_budget.remaining.toFixed(2)}</p>
                        <p>Budget Used: {production_budget.percent}%</p>
                    </div>
                        
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
                                adjust_data_object={project_submit_method === "edit" ? current_project.project_data : project_initial_form_data}
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
                                adjust_data_object={project_submit_method === "edit" ? current_project.project_data : project_initial_form_data}
                                send_table_data = {callback_handle_project_date_change}
                            />
                        </div>
                        <Provide_Context_employee_data>
                            {/* departments && pd_inputs */}
                            {departments.map((item)=>
                                <Pd_input
                                    key={`pd_input_${item.name}`}
                                    project_dates = {project_dates}
                                    dep_data = {item}
                                />)
                            }
                        </Provide_Context_employee_data>
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