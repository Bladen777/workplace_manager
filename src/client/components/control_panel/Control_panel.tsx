import { useState, useEffect, useContext } from "react"

// COMPONENT IMPORTS
import Control_panel_view from "./components/Control_panel_view.js"
import Control_panel_edit from "./components/Control_panel_edit.js"

// STYLE IMPORTS
import "../../styles/control_panel.css"

// CONTEXT IMPORTS
import { Use_Context_User_Info } from "../user_info/Context_user_info.js"
import { Use_Context_Section_Name } from "./context/Context_section_name.js"
import { Use_Context_Table_Info } from "./context/Context_db_table_info.js"


// TYPE DEFINITIONS
export interface Prop_types_control_panel_edit{
    submit_method: string;
    item_id: number;
    section_name: string;
  }
export interface Prop_types_control_panel_view{
    item_id: Function;
    view_order_key: string;
}


// THE COMPONENT
export default function Control_panel() {
    console.log('%cControl_panel Called', 'background-color:darkorchid',);

    // GETTING AND SETTING CURRENT USER INFO
    const user_info = useContext(Use_Context_User_Info).show_context;

    // GETTING THE SELECTED ITEM
    const [selected_item, set_selected_item]= useState<number>(0);

    // HANDLING NAVIGATIOIN ON CONTROL PANEL
    const [view_section, set_view_section] = useState<string>("");
    const [edit_section, set_edit_section] = useState<string>("");
    const [btn_method, set_btn_method] = useState<string>("");
    const [view_order_key, set_view_order_key] = useState<string>("");

    // UPDATING SECTION_NAME CONTEXT
    const new_section_name = useContext(Use_Context_Section_Name).update_func;
    const new_table_data = useContext(Use_Context_Table_Info).update_func;

    
    async function cp_nav_btn_clicked(section:string, view_order_id?:string){
        await new_table_data(section);
        await new_section_name(section);
        set_selected_item(0);
        set_view_section(section);
        set_edit_section("");
        set_view_order_key(view_order_id ? view_order_id : "");
    }

    function cpv_btn_clicked(btn_clicked:string){
        console.log("the selected_item: ", selected_item);
        set_edit_section(view_section);
        set_btn_method(btn_clicked);
    }
    console.log("the selected_item: ", selected_item);

    useEffect(() =>{
        (async()=>{
            const initial_section = "clients";
            await new_section_name(initial_section);
            await new_table_data(initial_section);
            set_view_section(initial_section);
        })();
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
                        onClick={()=>{cp_nav_btn_clicked("departments", "order")}}
                >
                    <h3>Departments</h3>
                </button>
            </div>  

            <div id="control_panel_views" className="control_panel_content_box">
                <div id="cpv_entry_box">

                    <Control_panel_view 
                        item_id={set_selected_item}
                        view_order_key= {view_order_key}
                    />
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
                    {selected_item !== 0 &&
                    <button id="cpv_delete_btn" className="control_panel_btn"
                            onClick={()=>cpv_btn_clicked("delete")}
                    > Delete  </button>
                    }
                    
                </div>
            </div>

            {edit_section !== "" &&
            <div id="control_panel_edits" className="control_panel_content_box">
                <h3>{btn_method === "add" ? "Add" : "Edit"} {edit_section}</h3>
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