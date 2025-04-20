import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Employee_select from "./employee_dd/Employee_select.js";
import Pd_budget from "./Pd_budget.js";

// CONTEXT IMPORTS 
import { Types_department_data, Use_Context_departments_data } from "../../../context/Context_departments_data.js";
import { Use_Process_input_data } from "../../../_universal/Process_input_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
import "../../../../styles/project/pd_input.css"

// TYPE DEFINITIONS

// THE COMPONENT 
function Pd_input() {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Pd_input`);

    const departments = useContext(Use_Context_departments_data).show_context;
    const process_data = useContext(Use_Process_input_data);

    
    function convert_text({text}:{text:string}){
        let new_text = text.replaceAll("_"," ")
        const first_letter = new_text.slice(0,1).toUpperCase();
        new_text = first_letter + text.slice(1);
        return new_text;
    }

// MEMOS AND EFFECTS

useEffect(() =>{
  const department_budget_data = departments.map((item:Types_department_data)=>{
    return({
        [`dep_id_${item.department.id}`]:0  
    })

  })
  process_data.handle_form_change({section_name:"projects", table_name: "project_department_budgets", form_data:department_budget_data})

},[])

// RETURNED VALUES 
    return(
        <form className="auto_form" id="edit_project_employee_select_box">
            <h3>Employee Select</h3>
            {departments.map((item)=>{
                return(
                    <div 
                        className="project_department_input_box"
                        key={`dropdown_for_${item.department.name}`} 
                        style={{backgroundColor:item.department.color}}
                    >
                        <h4>{convert_text({text:item.department.name})}</h4>
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