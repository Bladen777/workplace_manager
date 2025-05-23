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
import Animate_initial_load from "../../_universal/animations/Animate_initial_load.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../context/Context_initial_data.js"

// THE COMPONENT
export default function Project_overview() {
  const [ready, set_ready] = useState<boolean>(false);
  console.log(`%c COMPONENT `+ `%c Project_overview ` + `%c ${ready ? "READY" : "LOADING"} `, `${log_colors.component}`, '',`${log_colors.important}`);

  const initial_data = useContext(Use_Context_initial_data).show_context;
  const active_entry = useContext(Use_Context_active_entry).show_context;
  const user_data = useContext(Use_Context_user_info).show_context;

  const update_initial_data = useContext(Use_Context_initial_data).update_func;
  const update_active_entry = useContext(Use_Context_active_entry).update_func;

  // CONSTS FOR ANIMATING
      const animate_initial_load = Animate_initial_load() 
      const initial_animation_box = useRef<HTMLDivElement | null>(null);

      const animate_po_load = Animate_po_load();
      const animate_po_load_box_ref = useRef<HTMLDivElement | null>(null);
      const animate_po_load_hide_box_ref = useRef<HTMLDivElement | null>(null);
      

    async function initial_load(){
      const all_projects = await update_initial_data.wait({table_name: "projects"});
      const user_projects = await update_initial_data.wait({table_name: "project_employees", entry_id:user_data.id, entry_id_key:"employee_id"});
      //console.log(`%c DATA `, `${ log_colors.important_2 }`,`for all_projects`,'\n' ,all_projects);
      if(all_projects["projects"].data.length === 0){
        console.log(`%c NO EXISTING PROJECTS `, `${ log_colors.important_2 }`);
        await update_initial_data.wait({table_name: "project_departments"});
        await update_initial_data.wait({table_name: "project_employees"});
        await update_initial_data.wait({table_name: "project_groups"});
        await update_initial_data.now({table_name: "projects"});
        await update_active_entry.now({submit_method:"add"})
      } 
/*
      else if(user_projects["project_employees"].data.length > 0){
        const latest_project_id:number = user_projects["project_employees"].data[user_projects["project_employees"].data.length -1].project_id; 
        console.log(`%c LATEST USER PROJECT ID `, `${ log_colors.important_2 }`,'\n' ,latest_project_id);
        await update_project_data({project_id:latest_project_id});
      } 
*/
      
      else{
        const latest_project_id:number = all_projects["projects"].data[all_projects["projects"].data.length -1].id; 
        console.log(`%c LATEST PROJECT ID `, `${ log_colors.important_2 }`,'\n' ,latest_project_id);
        await update_project_data({project_id:latest_project_id});
      } 
      set_ready(true)
      console.log(`%c DATA `, `${ log_colors.data }`,`for skipped`);      
  }
  
  async function update_project_data({project_id}:{project_id:number}){
    ready && await animate_po_load.run_animation({animate_forwards:true});
    console.log(`%c PROJECT OVERVIEW UPDATE PROJECT DATA `, `${ log_colors.important_2 }`);
    
    const active_entry_update = await update_active_entry.wait({target_id:project_id});
    const client_id = (await update_initial_data.wait({table_name: "projects", entry_id_key:"id" ,entry_id:project_id}))["projects"].data[0]["client_id"];
    await update_initial_data.wait({table_name: "project_groups", entry_id_key:"client_id" ,entry_id:client_id});
    await update_initial_data.wait({table_name: "project_departments", entry_id_key:"project_id" ,entry_id:project_id});
    await update_initial_data.now({table_name: "project_employees", entry_id_key:"project_id" ,entry_id:project_id});
    update_active_entry.update_context(active_entry_update);

    ready && await animate_po_load.run_animation({animate_forwards:false})
  }

// MEMOS AND EFFECTS
  useMemo(() =>{
    initial_load()
  },[])

  useEffect(() =>{
    if(ready){
      animate_initial_load.initiate_animation({box_ele:initial_animation_box.current!})
      animate_po_load.initiate_animation({
          hide_ele:animate_po_load_hide_box_ref.current!,
          box_ele: animate_po_load_box_ref.current!,
      })
      animate_initial_load.run_animation({size:"big"})
    }
  },[ready])

  useEffect(() =>{
    if(ready && active_entry.target_id !== initial_data["projects"].data[0].id){
      update_project_data({project_id:active_entry.target_id!})
    }
  },[active_entry.target_id])


// RETURNED VALUES
  if(ready && initial_data["projects"].data.length > 0){
    return (
      <section id="project_overview" className="general_section initial_hide" ref={initial_animation_box}>
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



