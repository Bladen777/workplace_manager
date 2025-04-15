// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../../../styles/_log_colors.js";
import "../../../../../../styles/project/p_employee_select.css"

// TYPE DEFINITIONS
interface Types_props{
    name:string;
    rate:number;
}

// THE COMPONENT 
export default function P_employee_edit({name, rate}:Types_props) {
    console.log(`%c INPUT_COMPONENT `, `background-color:${ log_colors.input_component }`, `P_employee_edit`);


// MEMOS AND EFFECTS

// RETURNED VALUES 
    return(
        <div 
            className="employee_select_box" 
        >
            {/* LABEL FOR NAME */}
            <h3>{name}</h3>

            {/* LABEL FOR EMPLOYEE RATE */}
            <p> Rate: {rate}</p>


            {/* INPUT FOR BUDGET */}
            <label>
                <input

            
                />
            </label>
            
            {/* INPUT FOR HOURS */}
            <label>
                <input
                    className="employee_dd_hour_input"
                    
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