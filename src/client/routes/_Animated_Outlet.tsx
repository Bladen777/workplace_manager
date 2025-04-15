import React from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../styles/_log_colors.js";

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Animated_Outlet() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.component }`, `_Animated_Outlet`);

    const location = useLocation();
    const element = useOutlet();

// MEMOS AND EFFECTS


// RETURNED VALUES 
  return (
    <AnimatePresence mode="sync" initial={false}>
        {element && React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  ); 
}