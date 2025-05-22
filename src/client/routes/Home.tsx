import { useContext, useEffect } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../styles/_log_colors.js";
import "../styles/home.css"

// CONTEXT IMPORTS
import { Use_Context_user_info } from "../components/user_info/Context_user_info.js";

import { Provide_Context_initial_data } from "../components/context/Context_initial_data.js";
import { Provide_Context_active_entry } from "../components/context/Context_active_entry.js";
import { Provide_Process_input_data } from "../components/_universal/Process_input_data.js";

import { Provide_Context_departments_data } from "../components/context/Context_departments_data.js";
import { Provide_Context_project_budgets } from "../components/project/context/Context_project_budgets.js";

// HOOK IMPORTS

// COMPONENT IMPORTS
import Project_overview from "../components/project/project_overview/Project_overview.js";
import Edit_project from "../components/project/project_edit/Edit_project.js";
import Control_panel from "../components/control_panel/Control_panel.js"

// TYPE DEFINITIONS

// THE COMPONENT
export default function Home() {
    console.log(`%c ROUTE `, `${log_colors.route}`, `Home`);

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

        <Provide_Context_departments_data>

          <Provide_Context_project_budgets>
            <Provide_Context_initial_data>
              <Provide_Context_active_entry>
                <Provide_Process_input_data>

                  { user_info.is_admin && <Edit_project /> }
                   <Project_overview /> 
                  
                </Provide_Process_input_data>
              </Provide_Context_active_entry>
            </Provide_Context_initial_data>
          </Provide_Context_project_budgets>


            <Provide_Context_initial_data>
              <Provide_Context_active_entry>
                {user_info.is_admin && <Control_panel />}
              </Provide_Context_active_entry>
            </Provide_Context_initial_data>



        </Provide_Context_departments_data>

      </>
    )
  }
}



