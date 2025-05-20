import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
import "../../../../styles/project_edit/project_department_select.css";

// CONTEXT IMPORTS
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../context/Context_active_entry.js";

import { Use_Context_project_department_data } from "./context/Context_project_department_data.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 
import Employee_select from "./employee_dd/Employee_select.js";
import Pd_budget from "./Pd_budget.js";
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";

// TYPE DEFINITIONS
import { Types_department_data } from "../../../context/Context_departments_data.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";
import { Types_form_data } from "../../../context/Context_initial_data.js";
import { Types_project_dates } from "../Edit_project.js";

interface Types_props{
    department_data: Types_department_data;
    project_dates: Types_project_dates;
}


// THE COMPONENT 
function Project_department_select({department_data, project_dates}:Types_props) {

    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_department_select for ${department_data.name}`);

    const initial_data = JSON.parse(JSON.stringify(useContext(Use_Context_initial_data).show_context));
    const active_entry = useContext(Use_Context_active_entry).show_context;

    const update_project_department_data = useContext(Use_Context_project_department_data).update_func;

    const existing_department_data = initial_data["project_departments"].data.find((entry:Types_form_data)=>{
        if(entry.department_id === department_data.id){
            return entry;
        };
    });

    const pd_initial_form_data = (
        existing_department_data && active_entry.submit_method === "edit" ?
        existing_department_data : 
        initial_data["project_departments"].info.form_data
    );

    const [dep_selected, set_dep_selected] = useState<boolean>(false);
    const [dep_animation_running, set_dep_animation_running] = useState<boolean>(false);

    const pd_input_box_ele = useRef<HTMLDivElement | null>(null);


    const [dep_dates, set_dep_dates] = useState<Types_project_dates>({
        start_date: (pd_initial_form_data["start_date"] 
                        ? String(pd_initial_form_data["start_date"])  
                        : undefined
        ),
        finish_date: (pd_initial_form_data["finish_date"] 
                        ? String(pd_initial_form_data["finish_date"])  
                        : undefined
        )
    })    

    function convert_text({text}:{text:string}){
        let new_text = text.replaceAll("_"," ")
        const first_letter = new_text.slice(0,1).toUpperCase();
        new_text = first_letter + text.slice(1);
        return new_text;
    }

    function handle_date_change({input, db_column}:Types_input_change){
        set_dep_dates((prev_vals)=>{
            let date_type = db_column.includes("finish") ? "finish_date" :"start_date";
            const update_dates = {...prev_vals, [date_type]:input};
            const pd_data_update = update_project_department_data.wait({department_id: department_data.id, [db_column]: input})

            //update_project_department_data.now({department_id: department_data.id, [db_column]: input})                
            return update_dates;
        })
   }

    function adjust_date(){
        set_dep_dates((prev_vals)=>{
            
            const prev_dates = {...prev_vals};
            let update_dates = {...prev_vals};
            let date_type = "start_date"
    
            const start_date_time = (new Date(project_dates.start_date!)).getTime();
            const finish_date_time = (new Date(project_dates.finish_date!)).getTime();
    
            const dep_start_time = (new Date(prev_dates.start_date!)).getTime();
            const dep_finish_time = (new Date(prev_dates.finish_date!)).getTime();

            console.log(`%c IMPORTANT `, `${ log_colors.important }`,`for initial_data`,'\n' ,JSON.parse(JSON.stringify(initial_data)));
            console.log(`%c DATA `, `${ log_colors.data }`,`for initial_data`,'\n' ,initial_data);
            console.log(`%c DATA `, `${ log_colors.data }`,`for initial_data["project_departments"]`,'\n',  initial_data["project_departments"]);
            console.log(`%c DATA `, `${ log_colors.data }`,`for project_dates`,'\n' ,project_dates);
            console.log(`%c DATA `, `${ log_colors.data }`,`for prev_dates`,'\n' ,prev_dates);
            console.log(`%c DATA `, `${ log_colors.data }`,`for dep_dates`,'\n' ,dep_dates);
            console.log(`%c ADJUST DATE VALUES `, `${ log_colors.data }`,
                '\n' , `start_date_time: ${start_date_time} vs dep_start_time: ${dep_start_time}`,
                '\n' , `finish_date_time: ${finish_date_time} vs dep_finish_time: ${dep_finish_time}`,
            );

            if(start_date_time > dep_start_time || (project_dates.start_date !== undefined && prev_dates.start_date === undefined)){
                update_dates = {...update_dates, start_date:project_dates.start_date}
                const pd_data_update = update_project_department_data.wait({department_id: department_data.id, start_date: project_dates.start_date})

                //update_project_department_data.now({department_id: department_data.id, start_date: project_dates.start_date})
            };
    
            if(finish_date_time < dep_finish_time || (project_dates.finish_date !== undefined && prev_dates.finish_date === undefined)){
                update_dates = {...update_dates, finish_date:project_dates.finish_date}
                date_type = "finish_date";
                const pd_data_update = update_project_department_data.wait({department_id: department_data.id, finish_date: project_dates.finish_date})

                //update_project_department_data.now({department_id: department_data.id, finish_date: project_dates.finish_date})
            };
            console.log(`%c DATA `, `${ log_colors.data }`,`for update_dates`,'\n' ,update_dates);
            return update_dates;
        })
    }

        function handle_dep_click(){
            set_dep_animation_running(true);
            console.log(`%c DATA `, `${ log_colors.data }`,`for dep_selected`,'\n' ,dep_selected);
        if(dep_selected){
            remove_department();
        } else if(!dep_selected){
            set_dep_selected(true);

        }
    }

    async function add_department(){
        pd_input_box_ele.current!.style.animation = `toggle_pd_select_box 1s ease normal forwards`;
        pd_input_box_ele.current!.addEventListener("animationend", open_animation_ended);

        console.log(`%c DATA `, `${ log_colors.data }`,`for dep_dates`,'\n' ,dep_dates);
        let dep_start_date = dep_dates.start_date;
        let dep_finish_date = dep_dates.finish_date;

        if(!dep_dates.start_date){
            if(project_dates.start_date){
                dep_start_date = project_dates.start_date;
                set_dep_dates((prev_vals)=>{
                    return {
                        ...prev_vals,
                        start_date:project_dates.start_date
                    }
                })
            }
        }

        if(!dep_dates.finish_date){
            if(project_dates.finish_date){
                dep_finish_date = project_dates.finish_date;
                set_dep_dates((prev_vals)=>{
                    return {
                        ...prev_vals,
                        finish_date:project_dates.finish_date
                    }
                })
            }
        }

        const added_pd_data:Types_form_data = {
            id: existing_department_data ? existing_department_data.id : - 1,
            department_id: department_data.id,  
            start_date: dep_start_date,
            finish_date: project_dates.finish_date ? project_dates.finish_date : dep_dates.finish_date,
            budget: pd_initial_form_data.budget,
        }

        
        const pd_data_update = await update_project_department_data.wait(added_pd_data);

        function open_animation_ended(){
            pd_input_box_ele.current!.removeEventListener("animationend", open_animation_ended);
            pd_input_box_ele.current!.style.animation ="";
            //update_project_department_data.update_context(pd_data_update);
            set_dep_animation_running(false);
        }

    }

    async function remove_department(){
        pd_input_box_ele.current!.style.animation = `toggle_pd_select_box 1s ease reverse forwards`;
        pd_input_box_ele.current!.addEventListener("animationend", close_animation_ended);
        const pd_data_update = await update_project_department_data.wait({method:"delete", department_id: department_data.id});
        function close_animation_ended(){
            pd_input_box_ele.current!.removeEventListener("animationend", close_animation_ended);
            set_dep_animation_running(false);
            set_dep_selected(false);
            //update_project_department_data.now({method:"delete", department_id: department_data.id});
        }
    }


// MEMOS AND EFFECTS
    useMemo(() =>{
        if(dep_selected){
            if(project_dates.start_date || project_dates.finish_date){
                console.log(`%c PROJECT DATES CHANGED `, `${ log_colors.data }`,`for project_dates`,'\n' ,project_dates);
                adjust_date()
            }
        }
    },[project_dates])

    useEffect(() =>{
        if(dep_selected){
            //update_project_department_data.now();
            add_department();
        }
    },[dep_selected])


    useMemo(() => {
        if(active_entry.submit_method === "edit" && existing_department_data){
            const animating_ele = document.getElementById("edit_project_animation_container");
            animating_ele?.addEventListener("animationend", animation_finished);
            
            function animation_finished(){
                    animating_ele?.removeEventListener("animationend", animation_finished);
                    set_dep_selected(true)
            }
        }
    },[])


// RETURNED VALUES 
    if(department_data){
        return(
            <div 
                className="pd_select_container" 
                style={{backgroundColor:department_data.color}}
            >
                <div className="pd_select_title_box">

                    <button 
                        className="pd_select_add_btn general_btn"
                        onClick={ handle_dep_click}
                        type="button"
                        disabled = {dep_animation_running}    
                    >
                        {dep_selected ? "Remove" : "Add"} 
                    </button>
                    
                    <h4>{convert_text({text:department_data.name})}</h4>
                </div>
                
                {dep_selected && 
                    <div 
                        className="pd_select_input_box"
                        ref = {pd_input_box_ele}
                    >
                        <form className="project_dates pd_dates ">
                            <Form_auto_input
                                column_info = {{
                                    column_name: "start_date",
                                    is_nullable: "YES",
                                    input_type: "date"
                                    
                                }}
                                initial_data_object={pd_initial_form_data}
                                adjust_data_object={dep_dates}
                                date_range={{min: project_dates.start_date, max: project_dates.finish_date}}
                                send_table_data = {handle_date_change}
                            />
                            <Form_auto_input
                                column_info = {{
                                    column_name: "finish_date",
                                    is_nullable: "YES",
                                    input_type: "date"
                                }}
                                initial_data_object={pd_initial_form_data}
                                adjust_data_object={dep_dates}
                                date_range={{min: project_dates.start_date, max: project_dates.finish_date}}
                                send_table_data = {handle_date_change}
                            />
                        </form> 


                        <Pd_budget
                            department_data = {department_data}
                        />
                        <Employee_select
                            department_data = {department_data}
                            department_dates = {dep_dates}
                        />
                    </div>
                }
            </div>
        ); 
    }
}

export default memo(Project_department_select)