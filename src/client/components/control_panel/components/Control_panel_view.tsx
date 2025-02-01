import { useContext, useEffect, useMemo, useState } from "react";

// COMPONENT IMPORTS
import Control_panel_entries from "./Control_panel_entries.js";
import Control_panel_sort_button from "./Control_panel_sort_button.js";

// CUSTOM HOOKS
import useGetTableData from "./hooks/useGetTableData.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../context/Context_section_name.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_view as Prop_types} from "../Control_panel.js"
import { Types_form_data } from "../context/Context_db_table_info.js";

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/log_colors.js";

// THE COMPONENT
export default function Control_panel_view({ edit_btn_clicked}:Prop_types) {
    const section_name = useContext(Use_Context_Section_Name).show_context;

    const [view_order_key, set_view_order_key] = useState<string>();
    const table_data = useGetTableData({section_name: section_name, order_key:view_order_key});
    const [selected_entry, set_selected_entry] = useState<number>(0);

    
    const view_table = useMemo(()=>{
        if(table_data.length !== 0){
        console.log(`%c MEMO `, `background-color:${log_colors.memo}`, `Control_panel_view view_table for ${section_name}`);
        set_selected_entry(0)
        return(
            <div id="cpv_entry_box">
                {table_data && table_data.map((item:Types_form_data, index:number)=>{
                    return(
                        <figure 
                            key={index} 
                            onClick={()=>{
                                set_selected_entry(item.id!)
                            }}
                            className={index % 2 === 0 ? "cpv_entry" : "cpv_entry cpv_entry_odd"} 
                        >
                            <Control_panel_entries     
                                table_item = {item}
                            />
                        </figure>
                    ); 
                })}
            </div>
        );
    }
    },[table_data])
    const view_buttons = useMemo(()=>{
        console.log(`%c MEMO `, `background-color:${log_colors.memo}`, `Control_panel_view view_buttons for ${section_name}`);
        return(
            <div id="cpv_btns">
                <button id="cpv_add_btn" className="control_panel_btn"
                        onClick={()=>edit_btn_clicked("add")}
                > New </button>
                {selected_entry !== 0 &&
                <button id="cpv_edit_btn" className="control_panel_btn"
                        onClick={()=>edit_btn_clicked("edit", selected_entry)}
                > Edit  </button>
                }
                {selected_entry !== 0 &&
                <button id="cpv_delete_btn" className="control_panel_btn"
                        onClick={()=>edit_btn_clicked("delete", selected_entry)}
                > Delete  </button>
                }
                <Control_panel_sort_button 
                    change_sort = {set_view_order_key}
                />
                
                
            </div>
        )
    },[selected_entry])

    useMemo(()=>{
        set_view_order_key("")
    },[section_name])

    return (
        <article id="control_panel_views" className="control_panel_content_box">
            {view_table}
            {view_buttons}
        </article>
    );
}