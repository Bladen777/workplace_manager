import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 
import { Use_Process_input_data } from "../../../_universal/Process_input_data.js";
import { Use_Context_project_budgets } from "../../context/Context_project_budgets.js";
import { Use_Context_project_data } from "../../context/Context_project_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";
import { Types_department_data } from "../../../context/Context_departments_data.js";


interface Types_props{
    department_data: Types_department_data;
}

// THE COMPONENT 
export default function Pd_budget({department_data}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Pd_budget for ${department_data.name}`);

    const existing_project_data = useContext(Use_Context_project_data).show_context;
    const project_submit_method = existing_project_data.submit_method;
    const project_budgets = useContext(Use_Context_project_budgets).show_context;

    const update_department_budget = useContext(Use_Context_project_budgets).update_func;
    
    const [department_percent, set_department_percent] = useState<number>(0);
    const dep_id_name = `dep_id_${department_data.id}`
    const department_budget = project_budgets.departments[dep_id_name];
/*
    console.log(`%c DATA `, `${ log_colors.data }`,`for project_budgets`,'\n' ,project_budgets);
    console.log(`%c DATA `, `${ log_colors.data }`,`for dep_id_name`,'\n' ,dep_id_name);
    console.log(`%c DATA `, `${ log_colors.data }`,`for department_budget`,'\n' ,department_budget);
*/

    const process_data = useContext(Use_Process_input_data);


    function find_percent(){        
        let budget_percent:number = 0
        if(project_budgets.total !== 0){
            budget_percent = Number(((department_budget/project_budgets.total)*100).toFixed(2));
        }
        set_department_percent(budget_percent);
    }

    const callback_handle_pd_budget_change = useCallback(({input, db_column}:Types_input_change) =>{
        handle_pd_budget_change({input, db_column})
    },[])

    function handle_pd_budget_change({input, db_column}:Types_input_change){
        let input_number = Number(input);
        if(!input_number && input_number !== 0){
            return
        }

        let new_department_budget:number = input_number;

        if(db_column === "percent"){
            input_number = Number(input.slice(-2))
            new_department_budget = project_budgets.total*(input_number/100);
            set_department_percent(input_number);
        }
        
        update_department_budget.now({dep_id_name:dep_id_name, budget:(new_department_budget)})
        process_data.handle_form_change({section_name: "projects", table_name: "project_department_budgets" ,form_data: {input:new_department_budget , db_column:"budget"}});
        
        if(db_column !== "percent"){
            find_percent()
        }
    }

// MEMOS AND EFFECTS    
    useMemo(()=>{
        department_budget !== 0 && find_percent()
    },[project_budgets])
    

// RETURNED VALUES 
    return(
        <div className="project_department_budget_box">
        <Form_auto_input 
            label_name="Budget"
            column_info={{
                column_name: `budget`,
                is_nullable: "YES",
                input_type: "budget"
            }} 
            initial_data_object={{budget:0.00}}
            adjust_data_object={{budget: department_budget.toFixed(2)}}
            send_table_data = {callback_handle_pd_budget_change}
        />
        <label className="auto_form_input_label">
            <p>% of Budget: </p>
            <input
                id={`${dep_id_name}_percent`}
                className={"production_budget_percent_input"}
                name={`${dep_id_name}_percent`}
                type={"text"}
                autoComplete="off"
                value={department_percent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                    let value = e.target.value;
                    handle_pd_budget_change({input:value, db_column:"percent"})
                }}
            />
        </label>
    </div>
    );
}