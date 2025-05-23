import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../../../_universal/Process_input_data.js";

import { Use_Context_project_budgets } from "../../context/Context_project_budgets.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";

// TYPE DEFINITIONS
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";
import { Types_department_data } from "../../../context/Context_departments_data.js";

interface Types_props{
    department_data: Types_department_data;
}

// THE COMPONENT 
export default function Pd_budget({department_data}:Types_props) {
    console.log(`      %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Pd_budget for ${department_data.name}`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const process_data = useContext(Use_Process_input_data);

    const pd_budget_data = initial_data["project_departments"];

    const existing_pd_budget = pd_budget_data.data.find((entry)=>{
        if(entry.department_id === department_data.id){
            return entry;
        };
    });
    const initial_pd_budget_form_data = (
        existing_pd_budget && active_entry.submit_method === "edit"
        ? existing_pd_budget : 
        pd_budget_data.info.form_data
    );

    const [department_budget, set_department_budget] = useState<number>(Number(initial_pd_budget_form_data["budget"]!))

    const project_budgets = useContext(Use_Context_project_budgets).show_context;

    const update_department_budget = useContext(Use_Context_project_budgets).update_func;
    
    const [department_percent, set_department_percent] = useState<number>(0);
    const dep_id_name = `dep_id_${department_data.id}`
/*
    console.log(`%c DATA `, `${ log_colors.data }`,`for project_budgets`,'\n' ,project_budgets);
    console.log(`%c DATA `, `${ log_colors.data }`,`for dep_id_name`,'\n' ,dep_id_name);
    console.log(`%c DATA `, `${ log_colors.data }`,`for department_budget`,'\n' ,department_budget);
*/

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
        let input_number = Number(Number(input).toFixed(2));
        if(!input_number && input_number !== 0){
            return
        }

        let new_department_budget:number = input_number;

        if(db_column === "percent"){
            input_number = Number(input.slice(-2))
            new_department_budget = Number((project_budgets.total*(input_number/100)).toFixed(2));
            set_department_percent(input_number);
  
        }
        
        set_department_budget(new_department_budget);
        update_department_budget.now({dep_id_name:dep_id_name, budget:(new_department_budget)})
        process_data.update_data({table_name: "project_departments", form_data:{input:new_department_budget, db_column:"budget"}, entry_id_key:"department_id" ,entry_id:department_data.id})
    
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
        <form className="project_department_budget_box">
            <Form_auto_input 
                label_name="Budget"
                column_info={{
                    column_name: `budget`,
                    is_nullable: "YES",
                    input_type: "budget"
                }} 
                initial_data_object={initial_pd_budget_form_data}
                adjust_data_value={department_budget.toFixed(2)}
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
        </form>
    );
}