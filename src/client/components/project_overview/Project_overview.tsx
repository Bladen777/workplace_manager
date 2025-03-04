

// COMPONENT IMPORTS
import Pie_chart from "./project_overview_comps/Pie_chart.js"
import Budget_tracker from "./project_overview_comps/Budget_tracker.js"
import Date_tracker from "./project_overview_comps/Date_tracker.js"

// STYLE IMPORTS 
import "../../styles/project_overview.css"
import { log_colors } from "../../styles/_log_colors.js";


// THE COMPONENT
export default function Project_overview() {
  console.log(`%c COMPONENT `, `background-color:${log_colors.component}`, `Project_overview`);

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

  return (
    <div id="project_overview" className="general_section">
      <h1 id="project_overview_title">Project Overview</h1>
      <div id="department_legend">

      </div>
      <div id="project_department_legend" className="project_overview_content_box">
        Legend
      </div>
      <Pie_chart />
      <Budget_tracker />
      <Date_tracker />


    </div>
  )
}



