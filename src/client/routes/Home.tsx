import { useContext } from "react";

// COMPONENT IMPORTS
import Project_overview from "../components/project_overview/Project_overview.js"
import Control_panel from "../components/control_panel/Control_panel.js"
import useGetUserInfo from "../components/user_info/useGetUserInfo.js";

// STYLE IMPORTS
import "../styles/home.css"
import { log_colors } from "../styles/log_colors.js";

// CONTEXT IMPORTS
import { Use_Context_User_Info } from "../components/user_info/Context_user_info.js";
import { Provide_Context_Section_Name } from "../components/control_panel/context/Context_section_name.js";
import { Provide_Context_Table_Info } from "../components/control_panel/context/Context_db_table_info.js";


// THE COMPONENT
export default function Home() {
    console.log(`%c ROUTE `, `background-color:${log_colors.route}`, `Home`);
  useGetUserInfo()

  const user_info = useContext(Use_Context_User_Info).show_context;

  console.log("the user info: ", user_info);
  if(user_info.email !== "wait"){
    return (
      <>
          <Project_overview />
          <Provide_Context_Section_Name>
            <Provide_Context_Table_Info>  
              {user_info.is_admin && <Control_panel />}
            </Provide_Context_Table_Info>
          </Provide_Context_Section_Name>
      </>
    )
  }
}



