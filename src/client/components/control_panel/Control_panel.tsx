import { useState, useEffect } from "react"


// LOCAL IMPORTS
import Client_edit from "./control_panel_comps/control_panel_edits/Client_edit.js"
import Employee_edit from "./control_panel_comps/control_panel_edits/Employee_edit.js"
import Department_edit from "./control_panel_comps/control_panel_edits/Department_edit.js"
import Client_view from "./control_panel_comps/control_panel_views/Client_view.js"
import Employee_view from "./control_panel_comps/control_panel_views/Employee_view.js"
import Department_view from "./control_panel_comps/control_panel_views/Department_view.js"

import Control_panel_edit from "./control_panel_comps/control_panel_edits/Control_panel_edit.js"

import Get_user_info from "../admin_checks/Get_user_info.js"

import "../../styles/control_panel.css"

// TYPE DEFINITIONS
import { Types_user_info } from "../admin_checks/Get_user_info.js"
export interface Prop_types_control_panel_edit{
    submit_method:string,
    item_id:number,
    section_name:string
  }
export interface Prop_types_control_panel_view{
    item_id:Function
}


// THE COMPONENT
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

    // GETTING THE SELECTED ITEM
    const [selected_item, set_selected_item]= useState<number>(0);


    // HANDLING NAVIGATIOIN ON CONTROL PANEL
    const [view_section, set_view_section] = useState<string>("clients");
    const [edit_section, set_edit_section] = useState<string>("");
    const [btn_method, set_btn_method] = useState<string>("");


    function cp_nav_btn_clicked(section:string){
        set_selected_item(0)
        set_view_section(section);
        set_edit_section("");
    }

    function cpv_btn_clicked(btn_clicked:string){
        console.log("the selected_item: ", selected_item);
        set_edit_section(view_section);
        set_btn_method(btn_clicked);
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

                <button id="clients_btn"
                        className={view_section === "clients" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{cp_nav_btn_clicked("clients")}}
                >
                    <h3>Clients</h3>
                </button>
    
                <button id="employees_btn"
                        className={view_section === "employees" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{cp_nav_btn_clicked("employees")}}
                >
                    <h3>Employees</h3>
                </button>

                <button id="departments_btn"
                        className={view_section === "departments" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{cp_nav_btn_clicked("departments")}}
                >
                    <h3>Departments</h3>
                </button>

            </div>  

            <div id="control_panel_views" className="control_panel_content_box">
                <div id="cpv_entry_box">
                    {view_section === "clients" && <Client_view item_id={set_selected_item}/>}
                    {view_section === "employees" && <Employee_view item_id={set_selected_item}/>}
                    {view_section === "departments" && <Department_view item_id={set_selected_item}/>}
                </div>
                <div id="cpv_btns">
                    <button id="cpv_add_btn" className="control_panel_btn"
                            onClick={()=>cpv_btn_clicked("add")}
                    > New </button>
                    {selected_item !== 0 &&
                    <button id="cpv_edit_btn" className="control_panel_btn"
                            onClick={()=>cpv_btn_clicked("edit")}
                    > Edit  </button>

                    }
                    
                </div>
            </div>

            {edit_section !== "" &&
            <div id="control_panel_edits" className="control_panel_content_box">
                <h3>{btn_method === "add" ? "Add" : "Edit"} clients</h3>
                {/*}
                {edit_section === "clients" && 
                    <Client_edit 
                        submit_method = {btn_method}
                        item_id={selected_item}
                        section_name = {edit_section}
                />}
                {edit_section === "employees" && 
                    <Employee_edit 
                        submit_method = {btn_method}
                        item_id={selected_item}
                        section_name = {edit_section}
                />}
                {edit_section === "departments" && 
                    <Department_edit 
                        submit_method = {btn_method}
                        item_id={selected_item}
                        section_name = {edit_section}        
                />}

                */}
                <Control_panel_edit 
                submit_method = {btn_method}
                item_id = {selected_item}
                section_name = {edit_section}
            />
            </div>
            }

            

        
        </article>
        
        )
    } 
  }