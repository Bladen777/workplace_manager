import { useContext, useEffect } from "react";

// COMPONENT IMPORTS
import Project_overview from "../components/project_overview/Project_overview.js"
import Control_panel from "../components/control_panel/Control_panel.js"

// CONTEXT IMPORTS
import { Use_Context_User_Info } from "../components/user_info/Context_user_info.js";
import { Provide_Context_Table_Info } from "../components/control_panel/context/Context_db_table_info.js";
import { Provide_Context_Table_Data } from "../components/control_panel/context/Context_get_table_data.js";
import { Provide_Context_current_table_item } from "../components/control_panel/context/Context_current_table_item.js";

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
    update_user_info.now();
  },[])
  if(user_info.email !== "wait"){
    return (
      <>
        <Project_overview />
        <Provide_Context_Table_Info>
          <Provide_Context_Table_Data>
          <Provide_Context_current_table_item>
              {user_info.is_admin && <Control_panel />}
              </Provide_Context_current_table_item> 
          </Provide_Context_Table_Data>
        </Provide_Context_Table_Info>
      </>
    )
  }
}



