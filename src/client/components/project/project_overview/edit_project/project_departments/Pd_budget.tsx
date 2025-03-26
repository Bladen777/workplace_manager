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
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Pd_budgets`);

    const [department_budget, set_department_budget] = useState<number>(0);
    const [department_percent, set_department_percent] = useState<number>(0);


    function find_percent(){        
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for percent ran`);
        let budget_percent:number = 0
        if(total_budget !== 0){
            budget_percent = Number(((department_budget/total_budget)*100).toFixed(0));
        }
/*
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for department_budget`,'\n' ,department_budget);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for total_budget`,'\n' ,total_budget);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for budget_percent`,'\n' ,budget_percent); 

*/        set_department_percent(budget_percent);
    }

    function handle_pd_budget_change({input, db_column}:Types_input_change){
        let input_number = Number(input);
        if(!input_number && input_number !== 0){
            return
        }

        let new_department_budget:number = input_number;

        if(db_column === `${department_name}_percent`){
            input_number = Number(input.slice(-2))
            new_department_budget = total_budget*(input_number/100);
            set_department_percent(input_number);
        }
        set_department_budget(new_department_budget);
        adjust_budget_used(new_department_budget - department_budget);
    }

    useMemo(()=>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for memochanged`);
        find_percent()
    },[ department_budget])

    

    // RETURNED VALUES 
    return(
        <div className="project_department_budget_box">
        <Form_auto_input 
            column_info={{
                column_name: `${department_name}_budget`,
                is_nullable: "yes",
                input_type: "budget"
            }} 
            table_data_object={{[`${department_name}_budget`]: department_budget.toFixed(2)}}
            send_table_data = {({input, db_column}:Types_input_change)=>{
                handle_pd_budget_change({input:input, db_column:db_column})
            }}
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