import { useContext, useEffect, useMemo, useState } from "react"

// COMPONENT IMPORTS
import Pie_chart from "./project_overview_comps/Pie_chart.js"
import Budget_tracker from "./project_overview_comps/Budget_tracker.js"
import Date_tracker from "./project_overview_comps/Date_tracker.js"
import Project_details from "./project_overview_comps/Project_details.js" 

// CONTEXT IMPORTS 
import { Use_Context_project_data } from "../context/Context_project_data.js"

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/project/project_overview.css"

// TYPE DEFINITIONS
import { Types_form_data } from "../../control_panel/context/Context_db_table_info.js"

interface Types_change_project{
  id:number;
}

// THE COMPONENT
export default function Project_overview() {
  console.log(`%c COMPONENT `, `${log_colors.component}`, `Project_overview`);

  const existing_project_data = useContext(Use_Context_project_data).show_context
  const all_projects = existing_project_data.all_projects;
  const current_project = existing_project_data.current_project.project_data;
  const update_current_project = useContext(Use_Context_project_data).update_func; 

  const [display_project, set_display_project] = useState<Types_form_data>(current_project) 




  function change_current_project({id}:Types_change_project){

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
  useMemo(()=>{
    if(existing_project_data.submit_method !== "add"){
      set_display_project(current_project);
    }
  },[current_project])

// RETURNED VALUES
  if(current_project && Object.keys(current_project).length > 0){
    console.log(`%c CURRENT PROJECT EXISTS `, `${ log_colors.important }`,`for Object.keys(current_project).length`,'\n' ,Object.keys(current_project).length);
    return (
      <div id="project_overview" className="general_section">
        <h1 id="project_overview_title">Project Overview</h1>
        <h3>{display_project.project_name}</h3>
        <div id="project_department_legend" className="project_overview_content_box">
          Legend
        </div>
        <Pie_chart />
        <Budget_tracker />
        <Date_tracker />
        <Project_details />
      </div>
    )
  }      
 
}



