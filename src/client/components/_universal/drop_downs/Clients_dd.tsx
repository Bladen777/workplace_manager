// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Clients_dd() {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `clients_dd`);

    // GET CURRENT LIST OF CLIENT NAMES
    


    // RETURNED VALUES 
    return(
        <>
        <label>
            <p>Client</p>
            <input>
            
            </input>
            <button>
            
            </button>
        </label>
        </>
    ); 
}