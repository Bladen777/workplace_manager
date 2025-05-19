import { useContext, memo} from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 
import Control_panel_entry_data from "./Control_panel_entry_data.js";
import Employee_deps from "./Employee_deps.js";
import Client_project_groups from "./Client_project_groups.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../../context/Context_initial_data.js";


interface Types_props{
    is_active:boolean;
    active_table: string;
    item_data: Types_form_data;
    item_index: number;
    send_selected_ele: Function;
}


// THE COMPONENT 
function Control_panel_entry({is_active, active_table, item_data, item_index, send_selected_ele}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Control_panel_entry for ${item_data.name}`);

// MEMOS AND EFFECTS

// RETURNED VALUES 
    return(            
        <figure
            onClick={()=>{
                console.log(`%c CONTROL PANEL ENTRY CLICKED `, `${ log_colors.data }`,`for item_data`,'\n' ,item_data);
                send_selected_ele({item:item_data, index:item_index});
            }}
            className={
                item_index % 2 === 0 ? 
                `cpv_entry ${is_active && "selected_cpv_entry"}` 
                : 
                `cpv_entry cpv_entry_odd ${is_active && "selected_cpv_entry"}`   
            } 
        >
            <div className="control_panel_entry">
                <Control_panel_entry_data     
                    table_item = {item_data}
                    item_index = {item_index}
                    active_table = {active_table}
                />
                {active_table === "clients" &&
                    <Client_project_groups
                        client_id = {item_data.id!}
                    />
                } 
                {active_table === "employees" &&
                    <Employee_deps
                        employee_id = {item_data.id!}
                    />
                }   
            </div>
        </figure>
    ); 
}

export default memo(Control_panel_entry);

