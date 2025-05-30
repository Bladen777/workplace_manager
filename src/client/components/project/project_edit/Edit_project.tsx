import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/project_edit/edit_project.css";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../../_universal/Process_input_data.js";
import { Use_Context_project_budgets } from "../context/Context_project_budgets.js";
import { Use_Context_departments_data } from "../../context/Context_departments_data.js";

import { Provide_Context_employee_data } from "./project_departments/employee_dd/context/Context_employee_data.js";
import { Provide_Context_project_department_data } from "./project_departments/context/Context_project_department_data.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 
import Form_auto_input from "../../_universal/inputs/Form_auto_input.js";
import Clients_dd from "./client_and_project_group/Clients_dd.js";
import Project_department_select from "./project_departments/Project_department_select.js";

import Animate_edit_project from "./animations/Animate_edit_project.js";
import Animate_initial_load from "../../_universal/animations/Animate_initial_load.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../context/Context_initial_data.js";
import { Types_update_data } from "../../_universal/Process_input_data.js";
import { Types_input_change } from "../../_universal/inputs/Form_auto_input.js";
import { Types_column_info } from "../../context/Context_initial_data.js";

import { Types_department_budgets } from "../context/Context_project_budgets.js";
import { Types_department_data } from "../../context/Context_departments_data.js";
import { a } from "framer-motion/client";


interface Types_budget {
    remaining: number;
    percent: number;
}

export type Types_project_dates = string | undefined;

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

    const [status_message, set_status_message] = useState<string>("");
    const [edit_btn_clicked, set_edit_btn_clicked] = useState<boolean>(false);

    const [project_start_date, set_project_start_date] = useState<Types_project_dates>(undefined);
    const [project_finish_date, set_project_finish_date] = useState<Types_project_dates>(undefined);

    const [production_budget, set_production_budget] = useState<Types_budget>({
        remaining: 0,
        percent: 0
    })

    // CONSTS FOR ANIMATING
    const animate_initial_load = Animate_initial_load() 
    const initial_animation_box = useRef<HTMLDivElement | null>(null);

    const animate = Animate_edit_project();
    const edit_btn_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_input_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_btn_ref = useRef<HTMLButtonElement | null>(null);
    const add_btn_ref = useRef<HTMLButtonElement | null>(null);

    async function handle_edit_project_click({submit_method}:{submit_method?:string} = {}){
        set_status_message(""); 

        if(submit_method && submit_method !== active_entry.submit_method){
            await update_active_entry.now({submit_method:submit_method});
        } else {
            handle_animation(submit_method)
        }
    }

    function handle_animation(submit_method:string | undefined){
        if(edit_btn_clicked){
            set_edit_btn_clicked(false)
            //process_data.clear_form();
            animate.run_animation({animate_forwards:false})
        } else {
            set_edit_btn_clicked(true);
            animate.initiate_animation({
                btn_box_ele: edit_btn_box_ref.current!, 
                input_box_ele: edit_input_box_ref.current!, 
                btn_type: submit_method, 
                add_btn_ele: add_btn_ref.current!, 
                edit_btn_ele: edit_btn_ref.current!
            })
        }
    }

    async function adjust_initial_data(){
        console.log(`%c EDIT PROJECT INITIAL DATA ADJUST `, `${ log_colors.important}`);
        await process_data.clear_form();
        // SET PROCESS DATA VALUES FOR EDIT/ADD PROJECTS
        if(active_entry.submit_method === "edit"){
            process_data.update_data({table_name: "projects", form_data: [initial_data["projects"].data[0]]});
            process_data.update_data({
                table_name: "project_departments", 
                form_data: JSON.parse(JSON.stringify( initial_data["project_departments"].data))
            });
            initial_data["project_employees"].data.length > 0 && process_data.update_data({
                table_name: "project_employees", 
                form_data: JSON.parse(JSON.stringify( initial_data["project_employees"].data))
            });

        } else {
            process_data.update_data({table_name: "projects", form_data: [initial_data["projects"].info.form_data]});

        }

        // SET VALUES FOR PROJECT DATES
        
        set_project_start_date( active_entry.submit_method === "edit" && initial_data["projects"].data[0].start_date 
                        ? String(initial_data["projects"].data[0].start_date) 
                        : undefined
        )

        set_project_finish_date( active_entry.submit_method === "edit" && initial_data["projects"].data[0].finish_date 
                        ? String(initial_data["projects"].data[0].finish_date) 
                        : undefined
        )

        // SET INITIAL VALUES FOR PROJECT BUDGETS
        if(active_entry.submit_method === "edit"){
            const department_budgets:Types_department_budgets = {};
            let budget_used:number = 0;
            initial_data["project_departments"].data.forEach((entry)=>{

                department_budgets[`dep_id_${entry.department_id}`] = Number(entry.budget);
                budget_used += Number(entry.budget);
            })
            console.log(`%c DATA `, `${ log_colors.important }`,`for budget_used`,'\n' ,budget_used);

            await update_project_budgets.now({all_budgets:{
                total:Number(initial_data["projects"].data[0]["production_budget"]),
                used:budget_used,
                departments: department_budgets
            }})
        } else {
            await update_project_budgets.now({reset:true})
        }

        
        console.log(`%c UPDATE EDIT PROJECT NOW `, `${ log_colors.important }`);
    }

    function handle_form_change({form_data}:Types_update_data){
        process_data.update_data({section_name:"projects", table_name: "projects", form_data: form_data})

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
    }
    
    const callback_adjust_budget = useCallback(({total}:Types_adjust_budget)=>{
        update_project_budgets.now({total:true, budget:total})
    },[])


    function handle_project_date_change({input, db_column}:Types_input_change){
        db_column.includes("start") && set_project_start_date(input);
        db_column.includes("finish") && set_project_finish_date(input);

        process_data.update_data({table_name: "projects", form_data: {input:input ,db_column:db_column}})
    }

      async function update_project_data(){

        const client_id = (await update_initial_data.wait({table_name: "projects", entry_id_key:"id" ,entry_id:active_entry.target_id}))["projects"].data[0]["client_id"];
        await update_initial_data.wait({table_name: "project_groups", entry_id_key:"client_id" ,entry_id:client_id});
        await update_initial_data.wait({table_name: "project_departments", entry_id_key:"project_id" ,entry_id:active_entry.target_id});
        await update_initial_data.now({table_name: "project_employees", entry_id_key:"project_id" ,entry_id:active_entry.target_id});
        await adjust_initial_data()

    }

    async function post_form(){
        
        const response:{message:string, entry_id:number} = await process_data.post_data({
            submit_method:active_entry.submit_method, 
            display_entry_id: (active_entry.submit_method === "edit" ? initial_data["projects"].data[0].id : 0)
        })
        console.log(`%c POST FORM FOR PROJECTS `, `${ log_colors.important_2 }`,`for response`,'\n' ,response);
        
        if(response.message.includes("successfully")){
            console.log(`%c DATA `, `${ log_colors.data }`,`for active_entry.target_id`,'\n' ,active_entry.target_id);
            console.log(`%c DATA `, `${ log_colors.data }`,`for response.entry_id`,'\n' ,response.entry_id);
            if(active_entry.target_id !== response.entry_id){
                update_active_entry.update_context({target_id:response.entry_id});
            } else {
                update_project_data()
            }
            
        }
        set_status_message(response.message);
        setTimeout(() => {
            set_status_message("saved");
        }, 2000);

    }

/*
    const create_pd_input = useCallback((item:Types_department_data)=>{
        return(
            <Project_department_select
                key={`pd_input_${item.name}`}
                project_dates = {project_dates}
                department_data={item}
            />
        )
    },[project_dates])
*/

// MEMOS AND EFFECTS

    useEffect(() =>{
        animate_initial_load.initiate_animation({box_ele:initial_animation_box.current!});
        setTimeout(() => {
            animate_initial_load.run_animation({size:"small"});
        }, 1500);
    },[]);
    useMemo(()=>{
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
    },[project_budgets]);

    useMemo(() =>{
        if(active_entry.submit_method){
            (async ()=>{
                console.log(`%c DATA `, `${ log_colors.data }`,`for active_entry.submit_method`,'\n' ,active_entry.submit_method);
                await adjust_initial_data()
                handle_animation(active_entry.submit_method);
            })()
        }
    },[active_entry.submit_method]);


    useMemo(() =>{
        if(active_entry.submit_method === "edit"){
            edit_btn_clicked && handle_edit_project_click()
            adjust_initial_data()
        }
    },[initial_data]);
/*
    useMemo(() =>{
        (async ()=>{
            const test_id = 5;
            await update_initial_data.wait({table_name: "project_departments", entry_id_key:"project_id" ,entry_id:test_id});
            await update_initial_data.wait({table_name: "project_employees", entry_id_key:"project_id" ,entry_id:test_id});
            await update_initial_data.now({table_name: "projects", entry_id_key:"id" ,entry_id:test_id});
            await update_active_entry.now({target_id:test_id});
        })()
    },[])
*/

// RETURNED VALUES 

    return(
        <section id="edit_project_container" className="initial_hide" ref= {initial_animation_box} >
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

            <div
                id="edit_project_animation_container"
                ref = {edit_input_box_ref} 
                className="edit_project_input_container edit_project_input_container_closed"
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
                                    column.column_name.includes("project_group_id")
                                    || column.column_name.includes("start_date")
                                    || column.column_name.includes("finish_date")
                                    ||  column.column_name.includes("date_added")
                                    ||  column.column_name.includes("ship_date") 
                                    ||  column.column_name.includes("shipping_address")
                                ){
                                    return
                                } else {
                                    return(
                                        <Form_auto_input
                                            key={`input_for_${column.column_name}`}
                                            column_info = {column}
                                            initial_data_object={active_entry.submit_method === "edit" ? initial_data["projects"].data[0] : initial_data["projects"].info.form_data}
                                            send_table_data = {(form_data:Types_input_change)=>{handle_form_change({table_name: "projects", form_data:form_data})}}
                                        />
                                    )
                                }
                            })}
                        </form>
                        <form className="project_dates">
                            <Form_auto_input
                                column_info = {{
                                    column_name: "start_date",
                                    is_nullable: "YES",
                                    input_type: "date"
                                }}
                                label_name="Project Start Date"
                                initial_data_object={active_entry.submit_method === "edit" ? initial_data["projects"].data[0] : initial_data["projects"].info.form_data}
                                date_range={{max: project_finish_date}}
                                send_table_data = {handle_project_date_change}
                            />
                            <Form_auto_input
                                column_info = {{
                                    column_name: "finish_date",
                                    is_nullable: "YES",
                                    input_type: "date"
                                }}
                                label_name="Project Finish Date"
                                initial_data_object={active_entry.submit_method === "edit" ? initial_data["projects"].data[0] : initial_data["projects"].info.form_data}
                                date_range={{min: project_start_date}}
                                send_table_data = {handle_project_date_change}
                            />
                        </form>
                        <article className="auto_form" id="edit_project_dep_forms_box">
                            <h3>Department Budgets</h3>
                            {/* departments && pd_inputs */}
                                <Provide_Context_project_department_data>
                                    <Provide_Context_employee_data>
                                        {departments.map((item:Types_department_data)=>{
                                        return (
                                            <Project_department_select
                                                key={`pd_input_${item.name}`}
                                                project_start_date = {project_start_date}
                                                project_finish_date = {project_finish_date}
                                                department_data={item}
                                            />
                                        )
                                    })}
                                    </Provide_Context_employee_data>
                                </Provide_Context_project_department_data>
                            
                        </article>
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
                                {status_message !== "" && status_message !== "saved" &&
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
            </div>
            
        </section>
    ); 
}

