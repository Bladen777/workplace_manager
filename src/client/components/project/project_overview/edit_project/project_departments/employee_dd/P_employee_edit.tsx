// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
interface Types_props{
    name:string;
    rate:number;
}


// THE COMPONENT 
export default function P_employee_edit({name, rate}:Types_props) {
    console.log(`%c INPUT_COMPONENT `, `background-color:${ log_colors.input_component }`, `P_employee_edit`);


    // RETURNED VALUES 
    return(
        <div 
            key={`${name}`}
        >
            {/* LABEL FOR NAME */}
            <p>{name}</p>
            {/* INPUT FOR BUDGET */}
            <input
            
            />
            {/* INPUT FOR HOURS */}
            <input
                className="employee_dd_hour_input"
                
            />

            {/* BUTTON TO REMOVE EMPLOYEE */}
            <button
                className="employee_dd_del_btn"
            >X</button>
        </div>
    ); 
}