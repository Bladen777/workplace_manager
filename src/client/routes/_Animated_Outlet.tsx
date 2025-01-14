import React from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";


const AnimatedOutlet = () => {
    console.log('%cAnimated Outlet Called', 'background-color:purple',);

  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="sync" initial={false}>
        {element && React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
};

export default AnimatedOutlet;