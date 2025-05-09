import { useContext, useEffect, useMemo, useState } from "react"

// COMPONENT IMPORTS
import Project_nav from "./project_overview_comps/Project_nav.js" 
import Project_legend from "./project_overview_comps/Project_legend.js"
import Pie_chart from "./project_overview_comps/Pie_chart.js"
import Budget_tracker from "./project_overview_comps/Budget_tracker.js"
import Date_tracker from "./project_overview_comps/Date_tracker.js"
import Project_details from "./project_overview_comps/Project_details.js"

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../context/Context_active_entry.js";
import { Use_Context_user_info } from "../../user_info/Context_user_info.js"

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/project_overview/project_overview.css"

// TYPE DEFINITIONS
import { Types_form_data } from "../../context/Context_initial_data.js"



// THE COMPONENT
export default function Project_overview() {
  console.log(`%c COMPONENT `, `${log_colors.component}`, `Project_overview`);

  const initial_data = useContext(Use_Context_initial_data).show_context;
  const active_entry = useContext(Use_Context_active_entry).show_context;
  const user_data = useContext(Use_Context_user_info).show_context;

  const update_initial_data = useContext(Use_Context_initial_data).update_func;
  const update_active_entry = useContext(Use_Context_active_entry).update_func;

  const [ready, set_ready] = useState<boolean>(false);
  if(!ready){
    (async ()=>{
      const all_projects = await update_initial_data.wait({table_name: "projects"});
      const user_projects = await update_initial_data.wait({table_name: "employee_budgets", entry_id:user_data.id, entry_id_key:"employee_id"});
      console.log(`%c DATA `, `${ log_colors.data }`,`for all_projects`,'\n' ,all_projects);
      if(all_projects["projects"].data.length === 0){
        await update_active_entry.now({submit_method:"add"})
      } else if(user_projects["employee_budgets"].data.length > 0){
        const latest_project_id:number = user_projects["employee_budgets"].data[user_projects["employee_budgets"].data.length -1].project_id; 
        console.log(`%c DATA `, `${ log_colors.data }`,`for latest_project_id`,'\n' ,latest_project_id);
        await update_project_data({project_id:latest_project_id});
      } else{
        const latest_project_id:number = all_projects["projects"].data[all_projects["projects"].data.length -1].id; 
        console.log(`%c DATA `, `${ log_colors.data }`,`for latest_project_id`,'\n' ,latest_project_id);
        await update_project_data({project_id:latest_project_id});
      } 
      set_ready(true)
      //console.log(`%c DATA `, `${ log_colors.data }`,`for skipped`);      
  })()
  
  }

  const [content_is_loading, set_content_is_loading] = useState<boolean>(true);
  const display_project:Types_form_data =(
    (initial_data["projects"] && active_entry.target_id && initial_data["projects"].data.length > 0) 
    ? initial_data["projects"].data[0]
    : {}
  )

  async function update_project_data({project_id}:{project_id:number}){
    set_content_is_loading(true);

    const active_entry_update = await update_active_entry.wait({target_id:project_id});
    await update_initial_data.wait({table_name: "project_department_budgets", entry_id_key:"project_id" ,entry_id:project_id});
    await update_initial_data.wait({table_name: "employee_budgets", entry_id_key:"project_id" ,entry_id:project_id});
    await update_initial_data.now({table_name: "projects", entry_id_key:"id" ,entry_id:project_id});
    update_active_entry.update_context(active_entry_update);

    set_content_is_loading(false);
  }
  // Need data from departments table 
  // Need data from employee budget table
  // Need data from projects table


  /* 1. Pie Chart for project hours breakdown
        - has legend on side for department colours
        - has progress bars on side for % of budget used
          - has large bar on top for overall % of budget
        - has bar on bottom to indicate time until ship
          - has sections that separate when departments need to be done
          - have buffer hours as a nutral colour

      *** ONLY ADMIN SHOULD BE ABLE TO VIEW ALL DEPARTMENTS ON THIS CHART

      *** EMPLOYEES ONLY GET TO VIEW THE INFORMATION RELAVENT TO THEIR ASSIGNED PROJECTS
  */

// MEMOS AND EFFECTS


// RETURNED VALUES
  if(display_project && ready){
    console.log(`%c DATA `, `${ log_colors.data }`,`for display_project`,'\n' ,display_project);
    return (
      <div id="project_overview" className="general_section">
        <h1 id="project_overview_title">Project Overview</h1>
        {!content_is_loading &&
          <div className="project_overview_box">
            <Project_nav />
            <Project_legend/>
            <Pie_chart />
            <Budget_tracker />
            <Date_tracker />
            <Project_details />
          </div>
        }
        {content_is_loading &&
          <div className="cp_loader">
              Loading
          </div>
        }
      </div>
    )
  }      
 
}



