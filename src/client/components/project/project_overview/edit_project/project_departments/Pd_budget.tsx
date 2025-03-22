import { useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_input_change } from "../../../../_universal/inputs/Form_auto_input.js";


interface Types_props{
    department_name: string;
    total_budget:number;
    adjust_budget_used: Function;
}

// THE COMPONENT 
export default function Pd_budgets({department_name, total_budget, adjust_budget_used}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Project_department_budget_percents`);

    const [department_budget, set_department_budget] = useState<number>(0);
    const [department_percent, set_department_percent] = useState<number>(0);


    function find_percent(){    
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for department_budget`,'\n' ,department_budget);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for total_budget`,'\n' ,total_budget);
        const budget_percent = (department_budget/total_budget)*100;
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for budget_percent`,'\n' ,budget_percent); 
        set_department_percent(budget_percent);
    }

    function handle_pd_budget_change({input, db_column}:Types_input_change){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for input`,'\n' ,input);
        const input_number = Number(input);
        if(db_column === `${department_name}_budget`){
            const budget_difference =  input_number - department_budget ;
            adjust_budget_used(budget_difference)
            set_department_budget(input_number);
        } else if(db_column === `${department_name}_percent`){

        }
    }

    useMemo(()=>{
        find_percent()
    },[total_budget, department_budget])

    // RETURNED VALUES 
    return(
        <div className="project_department_budget_box">
        <Form_auto_input 
            column_info={{
                column_name: `${department_name}_budget`,
                is_nullable: "yes",
                input_type: "budget"
            }} 
            table_data_object={{[`${department_name}_budget`]: "0.00"}}
            send_table_data = {({input, db_column}:Types_input_change)=>{handle_pd_budget_change({input:input, db_column:db_column})}}
        />
        <label className="auto_form_input_label">
            <p>% of budget: </p>
            <input
                id={`${department_name}_percent`}
                className={"production_budget_percent_input"}
                name={`${department_name}_percent`}
                type={"text"}
                autoComplete="off"
                value={department_percent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                    let value = e.target.value;
                    handle_pd_budget_change({input:value, db_column:`${department_name}_percent`})
                }}
            />
        </label>
    </div>
    );
}