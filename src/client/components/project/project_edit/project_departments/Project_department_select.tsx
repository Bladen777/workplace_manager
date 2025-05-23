import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
import "../../../../styles/project_edit/project_department_select.css";

// CONTEXT IMPORTS
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../context/Context_active_entry.js";

import { Use_Context_project_department_data } from "./context/Context_project_department_data.js";
import { Use_Context_employee_data } from "./employee_dd/context/Context_employee_data.js";
import { Use_Context_project_budgets } from "../../context/Context_project_budgets.js";


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
    project_start_date: string | undefined;
    project_finish_date: string | undefined;
}

interface Types_dep_date_adjust{
    [key:string]: string | undefined;
    start_date: string | undefined;
    finish_date: string | undefined;
}


// THE COMPONENT 
function Project_department_select({department_data, project_start_date, project_finish_date}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_department_select for ${department_data.name}`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;

    const update_project_department_data = useContext(Use_Context_project_department_data).update_func;
    const update_employee_data = useContext(Use_Context_employee_data).update_func;
    const update_department_budget = useContext(Use_Context_project_budgets).update_func;

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

    const [dep_start_date, set_dep_start_date] = useState<Types_project_dates>(
        pd_initial_form_data["start_date"] 
        ? String(pd_initial_form_data["start_date"])  
        : undefined    
    );
    const [dep_finish_date, set_dep_finish_date] = useState<Types_project_dates>(
        pd_initial_form_data["finish_date"] 
        ? String(pd_initial_form_data["finish_date"])  
        : undefined
    );


    const [adjust_dep_dates, set_adjust_dep_dates] = useState<Types_dep_date_adjust>({
        start_date: (pd_initial_form_data["start_date"] 
                        ? String(pd_initial_form_data["start_date"])  
                        : undefined
        ),
        finish_date: (pd_initial_form_data["finish_date"] 
                        ? String(pd_initial_form_data["finish_date"])  
                        : undefined
        )
    })    

    const dep_name_string = convert_text({text:department_data.name})
    function convert_text({text}:{text:string}){
        let new_text = text.replaceAll("_"," ")
        const first_letter = new_text.slice(0,1).toUpperCase();
        new_text = first_letter + text.slice(1);
        return new_text;
    }

    async function handle_date_change({input, db_column}:Types_input_change){
        console.log(`%c DATE CHANGED `, `${ log_colors.update}`);
        await update_project_department_data.wait({department_id: department_data.id, [db_column]: input}) 
        db_column.includes("start") && set_dep_start_date(input);
        db_column.includes("finish") && set_dep_finish_date(input);
   }

    function adjust_date(){

            const prev_dates = {...adjust_dep_dates};
            let update_dates = {...adjust_dep_dates};

            const start_date_time = (new Date(project_start_date!)).getTime();
            const finish_date_time = (new Date(project_finish_date!)).getTime();
    
            const dep_start_time = (new Date(prev_dates.start_date!)).getTime();
            const dep_finish_time = (new Date(prev_dates.finish_date!)).getTime();


            console.log(`%c DATA `, `${ log_colors.data }`,`for initial_data["project_departments"]`,'\n',  initial_data["project_departments"]);
            console.log(`%c DATA `, `${ log_colors.data }`,`for prev_dates`,'\n' ,prev_dates);

            console.log(`%c ADJUST DATE VALUES `, `${ log_colors.data }`,
                '\n' , `start_date_time: ${start_date_time} vs dep_start_time: ${dep_start_time}`,
                '\n' , `finish_date_time: ${finish_date_time} vs dep_finish_time: ${dep_finish_time}`,
            );

            if(start_date_time > dep_start_time || (project_start_date !== undefined && prev_dates.start_date === undefined)){
                update_dates = {...update_dates, start_date:project_start_date}
                update_project_department_data.wait({department_id: department_data.id, start_date: project_start_date})
                set_dep_start_date(project_start_date);
            };
    
            if(finish_date_time < dep_finish_time || (project_finish_date !== undefined && prev_dates.finish_date === undefined)){
                update_dates = {...update_dates, finish_date:project_finish_date}
                update_project_department_data.wait({department_id: department_data.id, finish_date: project_finish_date})
                set_dep_finish_date(project_finish_date);
            };

            set_adjust_dep_dates(update_dates)
            console.log(`%c DATA `, `${ log_colors.data }`,`for update_dates`,'\n' ,update_dates);
    }

        function handle_dep_click(){
            set_dep_animation_running(true);
            console.log(`%c DEP SELECTED `, `${ log_colors.important }`,'\n' ,dep_selected);
        if(dep_selected){
            remove_department();
        } else if(!dep_selected){
            add_department();
        }
    }

    async function add_department(){
        console.log(`%c ADD DEPARTMNET `, `${ log_colors.important}`);
        let initial_start_date = dep_start_date;
        let initial_finish_date = dep_finish_date;

        if(!dep_start_date && project_start_date){
            set_dep_start_date(project_start_date);
            initial_start_date = project_start_date;
        }

        if(!dep_finish_date && project_finish_date){
            set_dep_finish_date(project_finish_date);
            initial_finish_date = project_finish_date;
        }

        const added_pd_data:Types_form_data = {
            id: pd_initial_form_data.id ? pd_initial_form_data.id : - 1,
            department_id: department_data.id,  
            start_date: initial_start_date,
            finish_date: initial_finish_date,
            budget: pd_initial_form_data.budget,
        }

        await update_project_department_data.wait(added_pd_data);
        set_dep_selected(true);
    }

    async function remove_department(){
        await update_project_department_data.wait({method:"delete", department_id: department_data.id});
        await update_employee_data.wait({method:"delete", department_id: department_data.id }); 
        
        pd_input_box_ele.current!.style.animation = `toggle_pd_select_box 1s ease reverse forwards`;
        pd_input_box_ele.current!.addEventListener("animationend", close_animation_ended);

        function close_animation_ended(){
            pd_input_box_ele.current!.removeEventListener("animationend", close_animation_ended);
            set_dep_animation_running(false);
            set_dep_selected(false);
        }
        await update_department_budget.now({dep_id_name:`dep_id_${department_data.id}`, budget:0})
    }


// MEMOS AND EFFECTS
    useMemo(() =>{
        if(dep_selected){
            if(project_start_date || project_finish_date){
                    console.log(`%c PROJECT DATES CHANGED `, `${ log_colors.data }`,'\n' , `project_start_date: ${project_start_date} & project_finish_date: ${project_finish_date}`);
                adjust_date()
            }
        }
    },[project_finish_date, project_start_date])

    useMemo(() =>{
      
    },[dep_selected]);

    useEffect(() =>{
      if(dep_selected){
        pd_input_box_ele.current!.style.animation = `toggle_pd_select_box 1s ease normal forwards`;
        pd_input_box_ele.current!.addEventListener("animationend", open_animation_ended);

        function open_animation_ended(){
            pd_input_box_ele.current!.removeEventListener("animationend", open_animation_ended);
            pd_input_box_ele.current!.style.animation ="";
            set_dep_animation_running(false);
        } 
      }
    },[dep_selected]);

    useMemo(() => {
        if(active_entry.submit_method === "edit" && existing_department_data){
            const animating_ele = document.getElementById("edit_project_animation_container");
            animating_ele?.addEventListener("animationend", animation_finished);
            
            function animation_finished(){
                    animating_ele?.removeEventListener("animationend", animation_finished);
                    add_department();
            }
        }
        
    },[])


/*
    useMemo(() =>{
      console.log(`%c PD INITIAL FORM DATA CHANGED `, `${ log_colors.update}`);
    },[pd_initial_form_data]);

    useMemo(() =>{
      console.log(`%c EXISTING DEPARTMENT DATA CHANGED `, `${ log_colors.update}`);
    },[existing_department_data]);

    useMemo(() =>{
      console.log(`%c ACTIVE ENTRY CHANGED `, `${ log_colors.update}`);
    },[active_entry]);

    useMemo(() =>{
      console.log(`%c INITIAL DATA CHANGED `, `${ log_colors.update}`);
    },[initial_data]);

    useMemo(() =>{
      console.log(`%c UPDATE PROJECT DEPARTMENT DATA CHANGED `, `${ log_colors.update}`);
    },[update_project_department_data]);

    useMemo(() =>{
      console.log(`%c UPDATE EMPLOYEE DATA CHANGED `, `${ log_colors.update}`);
    },[update_employee_data]);
    
    useMemo(() =>{
      console.log(`%c UPDATE DEPARTMENT BUDGET CHANGED `, `${ log_colors.update}`);
    },[update_department_budget]);

    useMemo(() =>{
        console.log(`%c DEP START DATE CHANGED `, `${ log_colors.update}`, dep_start_date);
    },[dep_start_date]);

    useMemo(() =>{
        console.log(`%c DEP FINISH DATE CHANGED `, `${ log_colors.update}`, dep_finish_date);
    },[dep_finish_date]);

    useMemo(() =>{
        console.log(`%c ADJUST_DEP_DATES CHANGED `, `${ log_colors.update}`, adjust_dep_dates);
    },[adjust_dep_dates]);

    useMemo(() =>{
        console.log(`%c DEP_ANIMATION CHANGED `, `${ log_colors.update}`);
    },[dep_animation_running]);

    useMemo(() =>{
        department_data && console.log(`%c DEPARTMENT_DATA CHANGED `, `${ log_colors.update}`);
    },[department_data]);

    useMemo(() =>{
        console.log(`%c PROJECT_START_DATE CHANGED `, `${ log_colors.update}`, project_start_date);
    },[project_start_date]);

    useEffect(() =>{
      console.log(`%c PROJECT_FINISH_DATE CHANGED `, `${ log_colors.update}`, project_finish_date);
    },[project_finish_date]);

    useEffect(() =>{
      return()=>{console.log(`%c DEPARTMENT SELECT UNLOADED `, `${ log_colors.important}`)}
    },[]);
*/



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
                    
                    <h4>{dep_name_string}</h4>
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
                                initial_data_object={{start_date: dep_start_date}}
                                adjust_data_value={adjust_dep_dates.start_date}
                                date_range={{min: project_start_date, max: project_finish_date}}
                                send_table_data = {handle_date_change}
                            />
                            <Form_auto_input
                                column_info = {{
                                    column_name: "finish_date",
                                    is_nullable: "YES",
                                    input_type: "date"
                                }}
                                initial_data_object={{finish_date: dep_finish_date}}
                                adjust_data_value={adjust_dep_dates.finish_date}
                                date_range={{min: project_start_date, max: project_finish_date}}
                                send_table_data = {handle_date_change}
                            />
                        </form> 


                        <Pd_budget
                            department_data = {department_data}
                        />
                        <Employee_select
                            department_data = {department_data}
                            dep_start_date = {dep_start_date}
                            dep_finish_date = {dep_finish_date}
                        />
                    </div>
                }
            </div>
        ); 
    }
}

export default memo(Project_department_select)