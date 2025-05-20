import { useContext, useEffect, useMemo, useRef, useState } from "react"

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/project_overview/project_overview.css"

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../context/Context_active_entry.js";
import { Use_Context_user_info } from "../../user_info/Context_user_info.js"

// HOOK IMPORTS 

// COMPONENT IMPORTS
import Project_nav from "./project_overview_comps/project_nav/Project_nav.js" 
import Project_legend from "./project_overview_comps/Project_legend.js"
import Pie_chart from "./project_overview_comps/Pie_chart.js"
import Budget_tracker from "./project_overview_comps/Budget_tracker.js"
import Date_tracker from "./project_overview_comps/Date_tracker.js"
import Project_details from "./project_overview_comps/Project_details.js"
import Animate_po_load from "./animations/Animate_po_load.js"

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

  // CONSTS FOR ANIMATING
      const animate_po_load = Animate_po_load();
      const animate_po_load_box_ref = useRef<HTMLDivElement | null>(null);
      const animate_po_load_hide_box_ref = useRef<HTMLDivElement | null>(null);
      

  if(!ready){
    (async ()=>{
      const all_projects = await update_initial_data.wait({table_name: "projects"});
      const user_projects = await update_initial_data.wait({table_name: "project_employees", entry_id:user_data.id, entry_id_key:"employee_id"});
      console.log(`%c DATA `, `${ log_colors.important_2 }`,`for all_projects`,'\n' ,all_projects);
      if(all_projects["projects"].data.length === 0){
        await update_initial_data.wait({table_name: "project_departments"});
        await update_initial_data.wait({table_name: "project_employees"});
        await update_initial_data.wait({table_name: "project_groups"});
        await update_initial_data.now({table_name: "projects"});
        await update_active_entry.now({submit_method:"add"})
      } else if(user_projects["project_employees"].data.length > 0){
        const latest_project_id:number = user_projects["project_employees"].data[user_projects["project_employees"].data.length -1].project_id; 
        console.log(`%c DATA `, `${ log_colors.important_2 }`,`for latest_project_id`,'\n' ,latest_project_id);
        await update_project_data({project_id:latest_project_id});
      } else{
        const latest_project_id:number = all_projects["projects"].data[all_projects["projects"].data.length -1].id; 
        console.log(`%c DATA `, `${ log_colors.important_2 }`,`for latest_project_id`,'\n' ,latest_project_id);
        await update_project_data({project_id:latest_project_id});
      } 
      set_ready(true)
      //console.log(`%c DATA `, `${ log_colors.data }`,`for skipped`);      
  })()
  
  }

  async function update_project_data({project_id}:{project_id:number}){
    ready && await animate_po_load.run_animation({animate_forwards:true});
    console.log(`%c PROJECT OVERVIEW UPDATE PROJECT DATA `, `${ log_colors.important_2 }`);
    
    const active_entry_update = await update_active_entry.wait({target_id:project_id});
    await update_initial_data.wait({table_name: "project_departments", entry_id_key:"project_id" ,entry_id:project_id});
    await update_initial_data.wait({table_name: "project_employees", entry_id_key:"project_id" ,entry_id:project_id});
    await update_initial_data.now({table_name: "projects", entry_id_key:"id" ,entry_id:project_id});
    update_active_entry.update_context(active_entry_update);

    ready && await animate_po_load.run_animation({animate_forwards:false})

  }

// MEMOS AND EFFECTS
  useEffect(() =>{
    if(ready){
      animate_po_load.initiate_animation({
          hide_ele:animate_po_load_hide_box_ref.current!,
          box_ele: animate_po_load_box_ref.current!,
      })
    }
    console.log(`%c DATA `, `${ log_colors.data }`,`for ready`,'\n' ,ready);
    console.log(`%c DATA `, `${ log_colors.data }`,`for animate_po_load_box_ref.current`,'\n' ,animate_po_load_box_ref.current);
  },[ready])

  useEffect(() =>{
    if(ready && active_entry.target_id !== initial_data["projects"].data[0].id){
      update_project_data({project_id:active_entry.target_id!})
    }
  },[active_entry.target_id])


// RETURNED VALUES
  if(ready && initial_data["projects"].data.length > 0){
    return (
      <section id="project_overview" className="general_section">
        <h2 id="project_overview_title">Project Overview</h2>
          <div className="project_overview_container">
            <div
              ref = {animate_po_load_hide_box_ref}
              className={"project_overview_hide_box project_overview_box_closed"}
            > 
            <p className="loading_text">LOADING</p>
            
              
            </div>
            <Project_nav />
            <div 
              ref = {animate_po_load_box_ref}
              className={"project_overview_box "}
            >    
              <Project_details />          
              <Project_legend/>
              <Pie_chart />
              <Budget_tracker />
              <Date_tracker />
            </div>
          
          
        </div>
      </section>
    )
  }      
 
}



