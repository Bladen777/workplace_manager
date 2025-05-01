import { useState, useContext, useMemo } from "react"

// COMPONENT IMPORTS
import Control_panel_view from "./components/Control_panel_view.js"
import Control_panel_edit from "./components/Control_panel_edit.js"

// CONTEXT IMPORTS

import { Provide_Process_input_data } from "../_universal/Process_input_data.js"
import { Use_Context_initial_data } from "../context/Context_initial_data.js"
import { Use_Context_active_entry } from "../context/Context_active_entry.js"

// HOOK IMPORTS

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../styles/_log_colors.js"
import "../../styles/control_panel/control_panel.css"

// TYPE DEFINITIONS
import { Types_form_data } from "../context/Context_initial_data.js"

interface Types_cpv_button{
    submit_method:string;
    table_item:Types_form_data;
}


// THE COMPONENT
export default function Control_panel() {
    console.log(`%c COMPONENT `, `${log_colors.component}`, `Control_panel`);

    // HANDLING NAVIGATIOIN ON CONTROL PANEL
    const [edit_section, set_edit_section] = useState<boolean>(false);
    const [active_table, set_active_table] = useState<string>("clients")
    const update_initial_data = useContext(Use_Context_initial_data).update_func;

    const [section_is_loading, set_section_is_loading] = useState<boolean>(true);

    // CONTROLLING VIEW UPDATES
    async function handle_cp_nav_btn_click(section:string) {
        if((section !== active_table) || edit_section){
            set_section_is_loading(true)
            const initial_data_update = await update_initial_data.wait({table_name: section})
            if(Object.keys(initial_data_update).length !== 0){
                update_initial_data.update_context(initial_data_update)
            }
            set_section_is_loading(false);
            set_active_table(section);
            set_edit_section(false);
        };
    }


// MEMOS AND EFFECTS
    useMemo(() =>{
        (async ()=>{
  /*
            const initial_data_update = await update_initial_data.wait({table_name: active_table})
            if(Object.keys(initial_data_update).length !== 0){
                update_initial_data.update_context(initial_data_update)
                set_section_is_loading(false)
            }
  */        await update_initial_data.now({table_name: active_table});
            set_section_is_loading(false);
        })()
        
    },[])

// RETRURNED VALUES      
    return (
        <section id="control_panel" className="general_section">
            <h1 id="control_panel_title">Control Panel</h1>

            <div id="control_panel_nav">
                <button id="clients_btn"
                        className={active_table === "clients"  ? "cp_nav_btn_active cp_nav_btn" : "cp_nav_btn"}
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


            {!edit_section && active_table && !section_is_loading &&
                <Control_panel_view 
                    active_table = {active_table}
                    open_edit = {()=>set_edit_section(true)}
                />   
            }
            {edit_section && !section_is_loading &&
                <Provide_Process_input_data>
                    <Control_panel_edit
                        active_table = {active_table} 
                        handle_cancel_edit_click = {()=>{set_edit_section(false)}}
                    />
                </Provide_Process_input_data>
            }
            {section_is_loading &&
                <div className="cp_loader">
                    Loading
                </div>
            }      
             
        </section>
    );

  }