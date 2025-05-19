import { useContext } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Project_details() {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_details`);

    const initial_data = useContext(Use_Context_initial_data).show_context;

// MEMOS AND EFFECTS

// RETURNED VALUES 
    return(
        <article 
            id="project_details"
            className="project_overview_content_box"    
        >
            <h3>Details</h3>
            <p>{initial_data["projects"].data[0]["details"]}</p>
        </article>
    ); 
}