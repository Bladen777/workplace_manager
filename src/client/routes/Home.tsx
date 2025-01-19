import { useState } from "react";


import { useContext } from "react";

// LOCAL IMPORTS
import Project_overview from "../components/project_overview/Project_overview.js"
import Control_panel from "../components/control_panel/Control_panel.js"
import useGetUserInfo from "../components/user_info/useGetUserInfo.js";
import { Use_Context_User_Info } from "../components/user_info/Context_user_info.js";

import "../styles/home.css"

// TYPE DEFINITIONS
import { Types_user_info } from "../components/user_info/Context_user_info.js";


// THE COMPONENT
export default function Home() {
  console.log('%cHome Called', 'background-color:purple',);
  useGetUserInfo()

  const user_info = useContext<Types_user_info>(Use_Context_User_Info);

  console.log("the user info: ", user_info);
  const [admin, set_admin] = useState<boolean>(true);

  return (
    <>
        <Project_overview />

        {admin && <Control_panel />}
        
    </>
  )
}



