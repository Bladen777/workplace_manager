// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Project_details() {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_details`);


// MEMOS AND EFFECTS

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