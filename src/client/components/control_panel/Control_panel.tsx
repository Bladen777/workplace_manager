import { useState, useEffect } from "react"


// LOCAL IMPORTS
import Client_edit from "./control_panel_comps/control_panel_edits/Client_edit.js"
import Project_edit from "./control_panel_comps/control_panel_edits/Project_edit.js"
import Employee_edit from "./control_panel_comps/control_panel_edits/Employee_edit.js"
import Department_edit from "./control_panel_comps/control_panel_edits/Department_edit.js"
import Client_view from "./control_panel_comps/control_panel_views/Client_view.js"
import Project_view from "./control_panel_comps/control_panel_views/Project_view.js"
import Employee_view from "./control_panel_comps/control_panel_views/Employee_view.js"
import Department_view from "./control_panel_comps/control_panel_views/Department_view.js"

import Get_user_info from "../admin_checks/Get_user_info.js"
import { Types_user_info } from "../admin_checks/Get_user_info.js"
import "../../styles/control_panel.css"

export default function Control_panel() {


    // GETTING AND SETTING CURRENT USER INFO
    const [user_info, set_user_info] = useState<Types_user_info>({
        email: "",
        is_admin: false
    })

    async function assign_user_info(){
        const fetched_user_info = await Get_user_info();
        set_user_info({
            email:fetched_user_info?.email!,
            is_admin:fetched_user_info?.is_admin!
        })
        console.log("fetched_user_info: ", fetched_user_info); 
    }


    // HANDLING NAVIGATIOIN ON CONTROL PANEL
    const [view_section, set_view_section] = useState<string>("project");
    const [edit_section, set_edit_section] = useState<string>("");


    function cp_nav_btn_clicked(section:string){
        set_view_section(section);
        set_edit_section("");
    }


    // THINGS TO DO ON INITIAL RENDER
    useEffect(()=>{
     assign_user_info();
    },[])

    if (user_info.is_admin){
        return (
            
        <article id="control_panel">
            <h1 id="control_panel_title">Control Panel</h1>

            <div id="control_panel_nav">
    
    
                <button id="projects_btn"
                        className={view_section === "project" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{cp_nav_btn_clicked("project")}}
                >
                    <h3>Projects</h3>
                </button>

                <button id="clients_btn"
                        className={view_section === "client" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{cp_nav_btn_clicked("client")}}
                >
                    <h3>Clients</h3>
                </button>
    
                <button id="employees_btn"
                        className={view_section === "employee" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{cp_nav_btn_clicked("employee")}}
                >
                    <h3>Employees</h3>
                </button>

                <button id="departments_btn"
                        className={view_section === "department" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{cp_nav_btn_clicked("department")}}
                >
                    <h3>Departments</h3>
                </button>

            </div>  

            <div id="control_panel_views" className="control_panel_content_box">
                <div id="cpv_entry_box">
                    {view_section === "project" && <Project_view />}
                    {view_section === "client" && <Client_view />}
                    {view_section === "employee" && <Employee_view />}
                    {view_section === "department" && <Department_view />}
                </div>
                <div id="cpv_btns">
                    <button id="cpv_edit_btn" className="cpv_btn"
                    
                    > Edit </button>
                    <button id="cpv_add_btn" className="cpv_btn"
                            onClick={()=>set_edit_section(view_section)}
                    > New </button>
                </div>
            </div>

            {edit_section !== "" &&
            <div id="control_panel_edits" className="control_panel_content_box">
                {edit_section == "project" && <Project_edit />}
                {edit_section == "client" && <Client_edit />}
                {edit_section == "employee" && <Employee_edit />}
                {edit_section == "department" && <Department_edit />}
            </div>
            }

        
        </article>
        
        )
    } 
  }