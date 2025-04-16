import { useState } from "react";

// COMPONENT IMPORTS 
import Process_input_data from "../../../../../_universal/Process_input_data.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../../../styles/_log_colors.js";
import "../../../../../../styles/project/p_employee_select.css"

// TYPE DEFINITIONS
import { Types_data_change } from "../../../../../_universal/Process_input_data.js";
import { Types_input_change } from "../../../../../_universal/inputs/Form_auto_input.js";
import { Types_form_data } from "../../../../../control_panel/context/Context_db_table_info.js";


interface Types_props{
    name:string;
    rate:number;
}

// THE COMPONENT 
export default function P_employee_edit({name, rate}:Types_props) {
    console.log(`%c INPUT_COMPONENT `, `background-color:${ log_colors.input_component }`, `P_employee_edit`);

    const process_data = Process_input_data()

    const [input_data, set_input_data] = useState<Types_form_data>()

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
            <h3>{name}</h3>

            {/* LABEL FOR EMPLOYEE RATE */}
            <p> Rate: ${rate}</p>


            {/* INPUT FOR BUDGET */}
            <label>
                <p>Budget:</p>
                <input
                    className="p_employee_input"
            
                />
            </label>
            
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
            >X</button>
        </div>
    ); 
}