import { useContext, useEffect } from "react";

// COMPONENT IMPORTS
import Project_overview from "../components/project_overview/Project_overview.js"
import Control_panel from "../components/control_panel/Control_panel.js"

// CONTEXT IMPORTS
import { Use_Context_User_Info } from "../components/user_info/Context_user_info.js";
import { Provide_Context_Section_Name } from "../components/control_panel/context/Context_section_name.js";
import { Provide_Context_Table_Info } from "../components/control_panel/context/Context_db_table_info.js";

// STYLE IMPORTS
import "../styles/home.css"

// LOG STYLE IMPORTS
import { log_colors } from "../styles/_log_colors.js";

// THE COMPONENT
export default function Home() {
    console.log(`%c ROUTE `, `background-color:${log_colors.route}`, `Home`);

  const update_user_info = useContext(Use_Context_User_Info).update_func;
  const user_info = useContext(Use_Context_User_Info).show_context;

  useEffect(() =>{
    update_user_info();
  },[])
  if(user_info.email !== "wait"){
    return (
      <>
        <Project_overview />
        <Provide_Context_Table_Info> 
          <Provide_Context_Section_Name> 
            {user_info.is_admin && <Control_panel />}
          </Provide_Context_Section_Name>
        </Provide_Context_Table_Info>
      </>
    )
  }
}



