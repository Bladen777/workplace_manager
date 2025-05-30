import React from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Animated_Outlet() {
    console.log(`%c COMPONENT `, `${ log_colors.component }`, `_Animated_Outlet`);

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