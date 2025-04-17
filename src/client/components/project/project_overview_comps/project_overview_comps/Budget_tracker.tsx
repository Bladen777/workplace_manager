// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Budget_tracker() {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Budget_tracker`);


// MEMOS AND EFFECTS


// RETURNED VALUES 
    return(
      <div id="budget_tracker" className="project_overview_content_box">
          Budget_tracker
      </div>
    ); 
}
