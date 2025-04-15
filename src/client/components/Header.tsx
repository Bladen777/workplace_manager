
// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../styles/_log_colors.js";
import "../styles/header.css"

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Header() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.component }`, `Header`);


// MEMOS AND EFFECTS


// RETURNED VALUES 
    return(
      <header>
        Header
      </header>
    ); 
}
