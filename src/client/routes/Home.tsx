import { useContext, useEffect } from "react";

// COMPONENT IMPORTS
import Project_overview from "../components/project/project_overview_comps/Project_overview.js"
import Edit_project from "../components/project/project_edit/Edit_project.js";
import Control_panel from "../components/control_panel/Control_panel.js"

// CONTEXT IMPORTS
import { Use_Context_user_info } from "../components/user_info/Context_user_info.js";
import { Provide_Context_table_info } from "../components/control_panel/context/Context_db_table_info.js";
import { Provide_Context_table_data } from "../components/control_panel/context/Context_get_table_data.js";
import { Provide_Context_current_table_item } from "../components/control_panel/context/Context_current_table_item.js";
import { Provide_Context_project_data } from "../components/project/context/Context_project_data.js";
import { Provide_Context_departments_data } from "../components/context/Context_departments_data.js";

// HOOK IMPORTS

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../styles/_log_colors.js";
import "../styles/home.css"

// TYPE DEFINITIONS

// THE COMPONENT
export default function Home() {
    console.log(`%c ROUTE `, `background-color:${log_colors.route}`, `Home`);

  const update_user_info = useContext(Use_Context_user_info).update_func;
  const user_info = useContext(Use_Context_user_info).show_context;

// MEMOS AND EFFECTS  
  useEffect(() =>{
    update_user_info.now();
  },[])

// RETRURNED VALUES  
  if(user_info.email !== "wait"){
    return (
      <>
        <Provide_Context_table_info>
          <Provide_Context_table_data>
            <Provide_Context_current_table_item>
              <Provide_Context_departments_data>
                <Provide_Context_project_data>
                  <Project_overview />
                    {user_info.is_admin && <Edit_project />}
                  </Provide_Context_project_data>
                  {user_info.is_admin && <Control_panel />}
                  </Provide_Context_departments_data>
              </Provide_Context_current_table_item> 
          </Provide_Context_table_data>
        </Provide_Context_table_info>
      </>
    )
  }
}



