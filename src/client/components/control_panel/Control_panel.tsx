import { useState, useContext, useMemo } from "react"

// COMPONENT IMPORTS
import Control_panel_view from "./components/Control_panel_view.js"
import Control_panel_edit from "./components/Control_panel_edit.js"

// CONTEXT IMPORTS
import { Use_Context_table_info } from "./context/Context_db_table_info.js"
import { Use_Context_table_data } from "./context/Context_get_table_data.js"
import { Use_Context_current_table_item } from "./context/Context_current_table_item.js"

// HOOK IMPORTS

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../styles/_log_colors.js"
import "../../styles/control_panel/control_panel.css"

// TYPE DEFINITIONS
import { Types_form_data } from "./context/Context_db_table_info.js"

interface Types_cpv_button{
    submit_method:string;
    table_item:Types_form_data;
}


// THE COMPONENT
export default function Control_panel() {
    console.log(`%c COMPONENT `, `background-color:${log_colors.component}`, `Control_panel`);

    // HANDLING NAVIGATIOIN ON CONTROL PANEL
    const [edit_section, set_edit_section] = useState<boolean>(false);

    const active_table = useContext(Use_Context_table_info).show_context.table_name;
    const update_table_data = useContext(Use_Context_table_data).update_func;
    const update_table_info = useContext(Use_Context_table_info).update_func;
    const update_current_table_item = useContext(Use_Context_current_table_item).update_func;

    async function update_context(section:string){
        const table_data_update = await update_table_data.wait({active_table:section});
        const table_info_update = await update_table_info.wait({active_table:section});
        update_table_data.update_context(table_data_update);
        update_table_info.update_context(table_info_update);
        return
    }

    // CONTROLLING VIEW UPDATES
    async function handle_cp_nav_btn_click(section:string) {
        if((section !== active_table) || edit_section){
            await update_context(section);
            set_edit_section(false);
        };
    }


// MEMOS AND EFFECTS
    useMemo(() =>{
        update_context("clients")
      },[])

// RETRURNED VALUES      
    return (
        <section id="control_panel" className="general_section">
            <h1 id="control_panel_title">Control Panel</h1>

            <div id="control_panel_nav">
                <button id="clients_btn"
                        className={active_table === "clients" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{handle_cp_nav_btn_click("clients")}}
                >
                    <h3>Clients</h3>
                </button>
    
                <button id="employees_btn"
                        className={active_table === "employees" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{handle_cp_nav_btn_click("employees")}}
                >
                    <h3>Employees</h3>
                </button>

                <button id="departments_btn"
                        className={active_table === "departments" ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
                        onClick={()=>{handle_cp_nav_btn_click("departments")}}
                >
                    <h3>Departments</h3>
                </button>
            </div>  

                {!edit_section && active_table &&
                    <Control_panel_view 
                        handle_edit_btn_click = {async ({submit_method, table_item}:Types_cpv_button)=>{
                            const current_table_item_update = await update_current_table_item.wait({
                                current_table_item:table_item,
                                submit_method:submit_method
                            })
                            update_current_table_item.update_context(current_table_item_update)
                            set_edit_section(true)
                        }}
                    />   
                }
                {edit_section &&
                    <Control_panel_edit 
                        handle_cancel_edit_click = {()=>{set_edit_section(false)}}
                    />
                }      
             
        </section>
    );

  }