import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Employee_select from "./employee_dd/Employee_select.js";
import Pd_budget from "./Pd_budget.js";
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../../context/Context_departments_data.js";
import { Use_Process_input_data } from "../../../_universal/Process_input_data.js";
import { Use_Context_project_data } from "../../context/Context_project_data.js";
import { Use_Context_project_dates } from "../../context/Context_project_dates.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
import "../../../../styles/project/pd_input.css"

// TYPE DEFINITIONS
import { Types_department_data } from "../../../context/Context_departments_data.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";

interface Types_dates_change extends Types_input_change{
    dep_id:number;
}


// THE COMPONENT 
function Pd_input() {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Pd_input`);

    const departments = useContext(Use_Context_departments_data).show_context;
    const current_project = useContext(Use_Context_project_data).show_context.current_project;
    const project_dates = useContext(Use_Context_project_dates).show_context;

    const update_project_dates = useContext(Use_Context_project_dates).update_func;
    const process_data = useContext(Use_Process_input_data);

    
    function convert_text({text}:{text:string}){
        let new_text = text.replaceAll("_"," ")
        const first_letter = new_text.slice(0,1).toUpperCase();
        new_text = first_letter + text.slice(1);
        return new_text;
    }

    function handle_date_change({dep_id, input, db_column}:Types_dates_change){
        
        update_project_dates.now({dep_id_name:`dep_id_${dep_id}`, date_type:db_column, date:input})    
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for dep_id`,'\n' ,dep_id);
        process_data.handle_form_change({section_name:"projects", table_name: "project_department_budgets", entry_id:dep_id, form_data:{input:input, db_column:db_column}})
    }

    function handle_project_date_change({input, db_column}:Types_input_change){
        update_project_dates.now({date_type:db_column, date:input})     
        process_data.handle_form_change({section_name:"projects", table_name: "projects", form_data:{input:input, db_column:db_column}})
    }

// MEMOS AND EFFECTS

useEffect(() =>{

  const department_budget_data = departments.map((item:Types_department_data)=>{
    return{
        department_id: item.department.id,
        start_date: "",
        finish_date: "",
        budget: 0
    }
  })

  process_data.handle_form_change({section_name:"projects", table_name: "project_department_budgets", form_data:department_budget_data})

},[])

// RETURNED VALUES 
    return(
        <form className="auto_form" id="edit_project_employee_select_box">
            <h3>Department Budgets</h3>
            <div className="project_dates">
                <Form_auto_input
                    column_info = {{
                        column_name: "start_date",
                        is_nullable: "YES",
                        input_type: "date"
                    }}
                    table_data_object={current_project.current_table_item}
                    send_table_data = {({input, db_column}:Types_input_change)=>{handle_project_date_change({input:input, db_column:db_column})}}
                />
                <Form_auto_input
                    column_info = {{
                        column_name: "finish_date",
                        is_nullable: "YES",
                        input_type: "date"
                    }}
                    table_data_object={current_project.current_table_item}
                    send_table_data = {({input, db_column}:Types_input_change)=>{handle_project_date_change({input:input, db_column:db_column})}}
                />
            </div>
            {departments.map((item)=>{
                return(
                    <div 
                        className="project_department_input_box"
                        key={`dropdown_for_${item.department.name}`} 
                        style={{backgroundColor:item.department.color}}
                    >
                        <h4>{convert_text({text:item.department.name})}</h4>

                        <div className="pd_dates project_dates">
                            <Form_auto_input
                                column_info = {{
                                    column_name: "start_date",
                                    is_nullable: "YES",
                                    input_type: "date"
                                }}
                                table_data_object={project_dates.departments[`dep_id_${item.department.id}`]}
                                date_range={{min: project_dates.start_date, max: project_dates.finish_date}}
                                send_table_data = {({input, db_column}:Types_input_change)=>{handle_date_change({dep_id:item.department.id, input:input, db_column:db_column})}}
                            />
                            <Form_auto_input
                                column_info = {{
                                    column_name: "finish_date",
                                    is_nullable: "YES",
                                    input_type: "date"
                                }}
                                table_data_object={project_dates.departments[`dep_id_${item.department.id}`]}
                                date_range={{min: project_dates.start_date, max: project_dates.finish_date}}
                                send_table_data = {({input, db_column}:Types_input_change)=>{handle_date_change({dep_id:item.department.id, input:input, db_column:db_column})}}
                            />
                        </div> 

                        <Pd_budget
                            department_data = {item}
                        />
                
                        <Employee_select
                            department_data = {item}
                        />
                    </div> 
                )   
            })}
        </form>
    ); 
}

export default memo(Pd_input)