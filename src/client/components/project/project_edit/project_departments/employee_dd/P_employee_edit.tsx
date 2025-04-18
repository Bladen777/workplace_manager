import { useContext, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 
import { Use_Process_input_data } from "../../../../_universal/Process_input_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js";
import "../../../../../styles/project/p_employee_select.css"

// TYPE DEFINITIONS
import { Types_data_change } from "../../../../_universal/Process_input_data.js";
import { Types_input_change } from "../../../../_universal/inputs/Form_auto_input.js";
import { Types_form_data } from "../../../../control_panel/context/Context_db_table_info.js";
import { Types_search_item } from "../../../../_universal/drop_downs/Input_drop_down.js";


interface Types_props{
    data:Types_search_item;
    rate:number;
    remove_employee: Function;
}

// THE COMPONENT 
export default function P_employee_edit({data, rate, remove_employee}:Types_props) {
    console.log(`%c INPUT_COMPONENT `, `background-color:${ log_colors.input_component }`, `P_employee_edit`);

    const process_data = useContext(Use_Process_input_data);

    const employee_budget = useRef<number>();

    const [employee_hours, set_employee_hours] = useState<Types_form_data>()

    function handle_input_change({input, db_column}:Types_input_change){
        
        const form_data: Types_input_change = {
            input: input,
            db_column: db_column
        }
        
        process_data.handle_form_change({table_name: "employee_budgets", form_data: form_data})
    }




// MEMOS AND EFFECTS

// RETURNED VALUES 
    return(
        <div 
            className="employee_select_box" 
        >
            {/* LABEL FOR NAME */}
            <h3>{data.name}</h3>

            {/* LABEL FOR EMPLOYEE RATE */}
            <p> Hourly Rate: ${rate}</p>


            {/* INPUT FOR BUDGET */}

            <Form_auto_input 
                column_info={{
                    column_name: `budget`,
                    is_nullable: "yes",
                    input_type: "budget"
                }} 
                send_table_data = {({input, db_column}:Types_input_change)=>{
                    handle_input_change({input:input, db_column:db_column})
                }}
            />

            {/* INPUT FOR HOURS */}
            <label>
                <p>Hours:</p>
                <input
                    className="p_employee_input"


                    
                />
            </label>
            
            {/* BUTTON TO REMOVE EMPLOYEE */}
            <button
                className="employee_dd_del_btn"
                type="button"
                onClick={()=>remove_employee()}
            >X</button>
        </div>
    ); 
}