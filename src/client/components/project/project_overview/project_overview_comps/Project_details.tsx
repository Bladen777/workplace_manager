// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Project_details() {
    console.log(`   %c COMPONENT `, `background-color:${ log_colors.component }`, `Project_details`);


    // RETURNED VALUES 
    return(
        <article 
            id="project_details"
            className="project_overview_content_box"    
        >
            Details
        </article>
    ); 
}