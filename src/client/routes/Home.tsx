import { useState } from "react";


// LOCAL IMPORTS
import Project_overview from "../components/project_overview/Project_overview.js"
import Control_panel from "../components/control_panel/Control_panel.js"
import "../styles/home.css"

export default function Home() {
  console.log('%cHome Started', 'background-color:purple',);


  const [admin, set_admin] = useState<boolean>(true);


  return (
    <>
        <Project_overview 
          admin ={admin}
        />

        {admin && <Control_panel />}
        
    </>
  )
}



