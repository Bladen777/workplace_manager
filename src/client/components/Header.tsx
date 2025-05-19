// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../styles/_log_colors.js";
import "../styles/header.css"

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Header() {
    console.log(`%c COMPONENT `, `${ log_colors.component }`, `Header`);


// MEMOS AND EFFECTS


// RETURNED VALUES 
    return(
      <header>
        Header
      </header>
    ); 
}
