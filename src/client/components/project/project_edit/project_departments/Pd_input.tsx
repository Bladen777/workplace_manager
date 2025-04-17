import { memo, useContext, useEffect, useMemo, useState } from "react";

// COMPONENT IMPORTS 
import Employee_select from "./employee_dd/Employee_select.js";
import Pd_budgets from "./Pd_budget.js";

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../../context/Context_departments_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
import "../../../../styles/project/pd_input.css"

// TYPE DEFINITIONS
interface Types_props {
    total_production_budget: number;
    adjust_budget_used: Function;
}


// THE COMPONENT 
function Pd_input({total_production_budget, adjust_budget_used}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Pd_input`);

    const departments = useContext(Use_Context_departments_data).show_context;
    
    function convert_text({text}:{text:string}){
        let new_text = text.replaceAll("_"," ")
        const first_letter = new_text.slice(0,1).toUpperCase();
        new_text = first_letter + text.slice(1);
        return new_text;
    }

// MEMOS AND EFFECTS

// RETURNED VALUES 
    return(
        <form className="auto_form" id="edit_project_employee_select_box">
            <h3>Employee Select</h3>
            {departments.map((item)=>{
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
                
                        <Employee_select
                            department_name = {department_name}
                        />
                    </div> 
                )   
            })}
        </form>
    ); 
}

export default memo(Pd_input)