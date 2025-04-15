// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../styles/_log_colors.js";
import "../styles/footer.css"

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Footer() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.component }`, `Footer`);


// MEMOS AND EFFECTS


// RETURNED VALUES 
    return(
      <footer>
        Footer
      </footer>
    ); 
}