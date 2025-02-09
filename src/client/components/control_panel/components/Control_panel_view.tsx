import { useContext, useEffect, useMemo, useState } from "react";

// COMPONENT IMPORTS
import Control_panel_entries from "./Control_panel_entries.js";
import Control_panel_sort_button from "./Control_panel_sort_button.js";
import { Use_Context_Table_Data } from "../context/Context_get_table_data.js";


// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../context/Context_section_name.js";
import { Use_Context_current_table_item } from "../context/Context_current_table_item.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_view as Prop_types} from "../Control_panel.js"
import { Types_form_data, Use_Context_Table_Info } from "../context/Context_db_table_info.js";

// STYLE IMPORTS
import "../../../styles/cp_view.css"

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/_log_colors.js";



// THE COMPONENT
export default function Control_panel_view({ handle_edit_btn_click}:Prop_types) {
    const section_name = useContext(Use_Context_Section_Name).show_context;
    console.log(`%c SUB-COMPONENT `, `background-color:${log_colors.sub_component}`, `Control_panel_view for`, section_name);

    const [view_order_key, set_view_order_key] = useState<string>();

    const update_initial_table_data = useContext(Use_Context_Table_Data).update_func;
    const update_current_table_item = useContext(Use_Context_current_table_item).update_func;
    const initial_form_data = useContext(Use_Context_Table_Info).show_context.initial_form_data;
    const initial_table_data = useContext(Use_Context_Table_Data).show_context;

    const [selected_entry, set_selected_entry] = useState<Types_form_data | number>(0);
    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for initial_table_data`,'\n' ,initial_table_data, selected_entry);
    
    const view_table = useMemo(()=>{
        selected_entry !== 0 && set_selected_entry(0)
        if(initial_table_data.length !== 0){
        console.log(`%c MEMO `, `background-color:${log_colors.memo}`, `Control_panel_view view_table for ${section_name}`);
 
        return(
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
        );
    }
    },[initial_table_data])




    useMemo(()=>{
        //set_view_order_key("")
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for view_order_key`,'\n' ,view_order_key);
         update_initial_table_data({order_key:view_order_key})
    },[view_order_key,initial_form_data])




    return (
        <article id="control_panel_views" className="control_panel_action_box">
            {view_table}
            <div id="cpv_btns" className="cp_utility_bar">
                <button id="cpv_add_btn" className="control_panel_btn"
                        onClick={()=>{
                            update_current_table_item({current_table_item:initial_form_data})
                            handle_edit_btn_click("add")
                        }}
                > New </button>
                {selected_entry !== 0 &&
                <button id="cpv_edit_btn" className="control_panel_btn"
                        onClick={()=>{
                            update_current_table_item({current_table_item:selected_entry})
                            handle_edit_btn_click("edit")
                        }}
                > Edit  </button>
                }
                {selected_entry !== 0 &&
                <button id="cpv_delete_btn" className="control_panel_btn"
                        onClick={()=>{
                            update_current_table_item({current_table_item:selected_entry})
                            handle_edit_btn_click("delete")
                        }}
                > Delete  </button>
                }
                <Control_panel_sort_button 
                    change_sort = {set_view_order_key}
                />
                
                
            </div>
        </article>
    );
}