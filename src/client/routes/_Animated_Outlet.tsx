import React from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// STYLE IMPORTS
import { log_colors } from "../styles/_log_colors.js";


const AnimatedOutlet = () => {
  console.log(`%c COMPONENT `, `background-color:${log_colors.component}`, `Animated_Outlet`);

  const location = useLocation();
  const element = useOutlet();

  return (
      <AnimatePresence mode="sync" initial={false}>
          {element && React.cloneElement(element, { key: location.pathname })}
      </AnimatePresence>
  );
};

export default AnimatedOutlet;