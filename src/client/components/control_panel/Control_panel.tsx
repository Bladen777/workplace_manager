import { useState, useEffect, useContext, useRef } from "react"

// COMPONENT IMPORTS
import Control_panel_view from "./components/Control_panel_view.js"
import Control_panel_edit from "./components/Control_panel_edit.js"

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "./context/Context_section_name.js"
import { Use_Context_Table_Info } from "./context/Context_db_table_info.js"

// STYLE IMPORTS
import "../../styles/control_panel.css"

// LOG STYLE IMPORTS
import { log_colors } from "../../styles/log_colors.js"

// TYPE DEFINITIONS
export interface Prop_types_control_panel_edit{
    submit_method: string;
    item_id: number;
    section_nav: Function;
  }
export interface Prop_types_control_panel_view{
    edit_btn_clicked: Function;
}


// THE COMPONENT
export default function Control_panel() {
    console.log(`%c COMPONENT `, `background-color:${log_colors.component}`, `Control_panel`);

    // GETTING THE SELECTED ITEM
    const [selected_item, set_selected_item]= useState<number>(0);

    // HANDLING NAVIGATIOIN ON CONTROL PANEL
    const initial_section = "clients";
    const [view_section, set_view_section] = useState<string>("");
    const [edit_section, set_edit_section] = useState<boolean>(false);
    const [btn_method, set_btn_method] = useState<string>("");


    // UPDATING SECTION_NAME CONTEXT
    const new_section_name = useContext(Use_Context_Section_Name).update_func;
    const new_table_data = useContext(Use_Context_Table_Info).update_func;

    async function cp_nav_btn_clicked(section:string){
        if(section !== view_section){
            await new_table_data(section)
            await new_section_name(section);
            set_selected_item(0);
            set_view_section(section);
            set_edit_section(false);
        };
    }

    function cpv_btn_clicked(btn_clicked:string, selected_item:number){
        set_selected_item(selected_item);
        set_edit_section(true);
        set_btn_method(btn_clicked);
    }

    useEffect(() =>{
        (async()=>{
            await new_section_name(initial_section);
            await new_table_data(initial_section);
            set_view_section(initial_section);
        })();
    },[])

    return (
        <section id="control_panel">
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

            {!edit_section && view_section &&
                <Control_panel_view 
                    edit_btn_clicked = {cpv_btn_clicked}
                />   
            }
            {edit_section &&
                <Control_panel_edit 
                    submit_method = {btn_method}
                    item_id = {selected_item}
                    section_nav = {cp_nav_btn_clicked}
            />
            }        
        </section>
    );

  }