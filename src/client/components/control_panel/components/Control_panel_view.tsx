import { memo, useContext, useEffect, useMemo, useState } from "react";

// COMPONENT IMPORTS
import Control_panel_entries from "./Control_panel_entries.js";
import Control_panel_sort_button from "./Control_panel_sort_button.js";
import { Use_Context_Table_Data } from "../context/Context_get_table_data.js";

// CONTEXT IMPORTS
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";
import { Use_Context_current_table_item } from "../context/Context_current_table_item.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_view as Prop_types} from "../Control_panel.js"
import { Types_form_data } from "../context/Context_db_table_info.js";

// STYLE IMPORTS
import "../../../styles/cp_view.css"

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/_log_colors.js";


// THE COMPONENT
export default function Control_panel_view({handle_edit_btn_click}:Prop_types) {
    const section_name = useContext(Use_Context_Table_Info).show_context.table_name;
    const initial_form_data = useContext(Use_Context_Table_Info).show_context.initial_form_data;
    const initial_table_data = useContext(Use_Context_Table_Data).show_context;

    const update_current_table_item = useContext(Use_Context_current_table_item).update_func;

    console.log(`%c SUB-COMPONENT `, `background-color:${log_colors.sub_component}`, `Control_panel_view for`, section_name, "\n", initial_table_data);

    const [selected_entry, set_selected_entry] = useState<Types_form_data | number>(0);

    return (
        <article id="control_panel_views" className="control_panel_action_box">
            <div id="cpv_entry_box" className="cp_content_box">
                {initial_table_data && initial_table_data.map((item:Types_form_data, index:number)=>{
                    return(
                        <figure 
                            key={index} 
                            onClick={()=>{
                                set_selected_entry(item)
                            }}
                            className={index % 2 === 0 ? "cpv_entry" : "cpv_entry cpv_entry_odd"} 
                        >
                            <div className="control_panel_entry">
                            <Control_panel_entries     
                                table_item = {item}
                            />
                            </div>
                        </figure>
                    ); 
                })}
            </div>

            <div id="cpv_btns" className="cp_utility_bar">
                <button id="cpv_add_btn" className="control_panel_btn"
                        onClick={()=>{
                            update_current_table_item.now({
                                current_table_item:initial_form_data,
                                submit_method:"add"
                            })
                            handle_edit_btn_click()
                        }}
                > New </button>
                {selected_entry !== 0 &&
                <button id="cpv_edit_btn" className="control_panel_btn"
                        onClick={()=>{
                            update_current_table_item.now({
                                current_table_item:selected_entry,
                                submit_method:"edit"
                            })
                            handle_edit_btn_click()
                        }}
                > Edit  </button>
                }
                {selected_entry !== 0 &&
                <button id="cpv_delete_btn" className="control_panel_btn"
                        onClick={()=>{
                            update_current_table_item.now({
                                current_table_item:selected_entry,
                                submit_method:"delete"
                            })
                            handle_edit_btn_click()
                        }}
                > Delete  </button>
                }
                <Control_panel_sort_button />
                
            </div>
        </article>
    );

}

