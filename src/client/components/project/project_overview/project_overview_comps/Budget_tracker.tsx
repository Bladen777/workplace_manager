import { useContext } from "react";
// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";


// TYPE DEFINITIONS


// THE COMPONENT 
export default function Budget_tracker() {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Budget_tracker`);

      const initial_data = useContext(Use_Context_initial_data).show_context;


// MEMOS AND EFFECTS


// RETURNED VALUES 
    return(
      <article id="budget_tracker" className="project_overview_content_box">
         <h3>Budget Tracker</h3> 
         <h2> UNDER WORK</h2>
      </article>
    ); 
}
