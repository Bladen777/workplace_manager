import { memo, useContext, useEffect, useMemo, useState } from "react";

// COMPONENT IMPORTS 
import Employee_dd from "./employee_dd/Employee_dd.js";
import Pd_budgets from "./Pd_budget.js";

import Process_input_data from "../../../../_universal/Process_input_data.js";

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../../../context/Context_departments_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
import "../../../../../styles/project/pd_input.css"

// LOG STYLE 
import { log_colors } from "../../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_data_change } from "../../../../_universal/Process_input_data.js";
import { Types_input_change } from "../../../../_universal/inputs/Form_auto_input.js";

interface Types_props {
    total_production_budget: number;
    edit_btn_clicked: boolean | null;
    adjust_budget_used: Function;
}




// THE COMPONENT 
function Pd_input({total_production_budget, edit_btn_clicked, adjust_budget_used}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Pd_input`);

    useEffect(()=>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for department_name`,'\n' ,total_production_budget);
    },[total_production_budget])

    useEffect(()=>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for total_budget`,'\n' ,edit_btn_clicked);
    },[edit_btn_clicked])

    useEffect(()=>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for adjust_budget_used`,'\n' ,adjust_budget_used);
    },[adjust_budget_used])


    const departments = useContext(Use_Context_departments_data).show_context;

    const process_data = Process_input_data();

    function handle_form_change({form_data}:Types_data_change){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data);
        process_data.handle_form_change({table_name: "Projects", form_data: form_data})
    }

    
    function convert_text({text}:{text:string}){
        let new_text = text.replaceAll("_"," ")
        const first_letter = new_text.slice(0,1).toUpperCase();
        new_text = first_letter + text.slice(1);
        return new_text;
    }


    // RETURNED VALUES 
    return(
        <form className="auto_form" id="edit_project_employee_select_box">
            <h3>Employee Select</h3>
            {edit_btn_clicked && departments.map((item)=>{
                const department_name = `dep_id_${item.department.id}`;
                return(
                    <div 
                        className="project_department_input_box"
                        key={`dropdown_for_${department_name}`} 
                        style={{backgroundColor:item.department.color}}
                    >
                        <h4>{convert_text({text:department_name})}</h4>
                        <Pd_budgets 
                            department_name = {department_name}
                            total_budget = {total_production_budget}
                            adjust_budget_used={(value:number)=>{adjust_budget_used(value)}}
                        />
                
                        <Employee_dd
                            department_name = {department_name}
                            send_table_data = {(form_data:Types_input_change)=>{handle_form_change({form_data:form_data})}}
                        />
                    </div> 
                )   
            })}
        </form>
    ); 
}

export default memo(Pd_input)