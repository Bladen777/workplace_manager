import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Employee_select from "./employee_dd/Employee_select.js";
import Pd_budget from "./Pd_budget.js";
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 

import { Use_Context_project_data } from "../../context/Context_project_data.js";

import { Use_Process_input_data } from "../../../_universal/Process_input_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
import "../../../../styles/project/pd_input.css"

// TYPE DEFINITIONS
import { Types_department_data } from "../../../context/Context_departments_data.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";
import { Types_form_data } from "../../../context/Context_initial_data.js";
import { Types_project_dates } from "../Edit_project.js";

interface Types_props{
    dep_data:Types_department_data;
    project_dates: Types_project_dates;
}


// THE COMPONENT 
function Pd_input({dep_data, project_dates}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Pd_input for ${dep_data.name}`);

    const existing_project_data = useContext(Use_Context_project_data).show_context;
    const process_data = useContext(Use_Process_input_data);

    const existing_pd_dates = existing_project_data.current_project.project_department_budgets.find((entry)=>{
        if(entry.department_id === dep_data.id){
            return entry;
        };
    });
    const pd_initial_form_data = (
        existing_pd_dates && existing_project_data.submit_method === "edit" ?
        existing_pd_dates : 
        existing_project_data.table_info.project_department_budgets.initial_form_data
    );

    const [dep_dates, set_dep_dates] = useState<Types_project_dates>({
        start_date:String(pd_initial_form_data.start_date),
        finish_date: String(pd_initial_form_data.finish_date)
    })    

    function convert_text({text}:{text:string}){
        let new_text = text.replaceAll("_"," ")
        const first_letter = new_text.slice(0,1).toUpperCase();
        new_text = first_letter + text.slice(1);
        return new_text;
    }


    

    const callback_handle_date_change = useCallback(({input, db_column}:Types_input_change) =>{
        handle_date_change({input, db_column})
    },[])

    function handle_date_change({input, db_column}:Types_input_change){
        set_dep_dates((prev_vals)=>{
            console.log(`%c DATA `, `${ log_colors.data }`,`for prev_vals`,'\n' ,prev_vals);
            let date_type = db_column.includes("finish") ? "finish_date" :"start_date";
            const update_dates = {...prev_vals, [date_type]:input}
            process_data.update_data({table_name: "project_department_budgets", form_data:{input:input, db_column:db_column}, entry_id_key:"department_id" ,entry_id:dep_data.id})
                
            return update_dates;
        })
   }

    function adjust_date(){
        set_dep_dates((prev_vals)=>{
            let update_dates = {...prev_vals};
            let date_change = undefined;
            let date_type = "start_date"
    
            const start_date_time = (new Date(project_dates.start_date!)).getTime();
            const finish_date_time = (new Date(project_dates.finish_date!)).getTime();
    
            const dep_start_time = (new Date(dep_dates.start_date!)).getTime();
            const dep_finish_time = (new Date(dep_dates.finish_date!)).getTime();
    
            if(start_date_time > dep_start_time || (project_dates.start_date !== undefined && dep_dates.start_date === undefined)){
                update_dates = {...update_dates, start_date:project_dates.start_date}
                date_change = project_dates.start_date;
            };
    
            if(finish_date_time < dep_finish_time || (project_dates.finish_date !== undefined && dep_dates.finish_date === undefined)){
                console.log(`%c DATA `, `${ log_colors.data }`,'\n',`for finish_date_time`, finish_date_time, ` vs `, `dep_finish_time`, dep_finish_time, `update_dates`, update_dates);
                update_dates = {...update_dates, finish_date:project_dates.finish_date}
                date_change = project_dates.finish_date;
                date_type = "finish_date";
            };
    
            console.log(`%c DATA `, `${ log_colors.data }`,`for update_dates`,'\n' ,update_dates);
            process_data.update_data({table_name: "project_department_budgets", form_data:{input:date_change, db_column:date_type}, entry_id_key:"department_id" ,entry_id:dep_data.id})
            return update_dates;
        })
    }


// MEMOS AND EFFECTS

    useEffect(() =>{
        //process_data.handle_form_change({section_name:"projects", table_name: "project_department_budgets", form_data:pd_initial_form_data, entry_id:dep_data.id})
    },[])

    useMemo(() =>{
    console.log(`%c DEP DATA CHANGED `, `${log_colors.data}`,`for dep_data`,'\n' ,dep_data);
    },[dep_data])

    useMemo(() =>{
        if(project_dates.start_date || project_dates.finish_date){
            console.log(`%c PROJECT DATES CHANGED `, `${ log_colors.data }`,`for project_dates`,'\n' ,project_dates);
            adjust_date()
        }
    },[project_dates])

    console.log(`%c PD_INPUT PROJECT DATES `, `${ log_colors.important_2 }`,`for project_dates`,'\n' ,project_dates);
// RETURNED VALUES 
    if(dep_data){
        return(
            <div 
                className="project_department_input_box" 
                style={{backgroundColor:dep_data.color}}
            >
                <h4>{convert_text({text:dep_data.name})}</h4>
    
                <div className="pd_dates project_dates">
                    <Form_auto_input
                        column_info = {{
                            column_name: "start_date",
                            is_nullable: "YES",
                            input_type: "date"
                            
                        }}
                        initial_data_object={pd_initial_form_data}
                        adjust_data_object={dep_dates}
                        date_range={{min: project_dates.start_date, max: project_dates.finish_date}}
                        send_table_data = {callback_handle_date_change}
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
                        send_table_data = {callback_handle_date_change}
                    />
                </div> 
    
                <Pd_budget
                    dep_data = {dep_data}
                />
        
                <Employee_select
                    department_data = {dep_data}
                    dep_dates = {dep_dates}
                />
            </div>
        ); 
    }
}

export default memo(Pd_input)