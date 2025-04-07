import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS
import Control_panel_sort_button from "./control_panel_view/Control_panel_sort_button.js";
import { Use_Context_table_data } from "../context/Context_get_table_data.js";
import Control_panel_entry from "./control_panel_view/Control_panel_entry.js";


// CONTEXT IMPORTS
import { Use_Context_table_info } from "../context/Context_db_table_info.js";

// STYLE IMPORTS
import "../../../styles/control_panel/cp_view.css"

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Types_form_data } from "../context/Context_db_table_info.js";



// THE COMPONENT
export default function Control_panel_view({handle_edit_btn_click}:{handle_edit_btn_click:Function}) {
    const section_name = useContext(Use_Context_table_info).show_context.table_name;
    const initial_form_data = useContext(Use_Context_table_info).show_context.initial_form_data;
    const initial_table_data = useContext(Use_Context_table_data).show_context;


    console.log(`%c SUB-COMPONENT `, `background-color:${log_colors.sub_component}`, `Control_panel_view for`, section_name, "\n", initial_table_data);

    const [entry_selected, set_entry_selected] = useState<boolean>(false);
    const selected_entry = useRef<Types_form_data | null>(null);
    const selected_ele_id = useRef<number>(0)

    useMemo(()=>{
        set_entry_selected(false)
        selected_entry.current = null;
    },[section_name])

    function handle_selected_entry(item:Types_form_data){
        if(!entry_selected){
            set_entry_selected(true)
        }
        selected_ele_id.current = item.id!;
        selected_entry.current = item;
    }

    const handle_callback_selected_entry = useCallback((item:Types_form_data)=>{
        handle_selected_entry(item)
    },[])


    function track_selection(item_id:number){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for track_selection called`,'\n' ,item_id, " vs ", selected_ele_id.current);
        if(selected_ele_id.current === item_id){
            return true
        } else {
            return false
        }

    }


    return (
        <article id="control_panel_views" className="control_panel_action_box">
            <div id="cpv_entry_box" className="cp_content_box">
            {initial_table_data.map((item:Types_form_data, index:number)=>{
                    return(
                        <Control_panel_entry
                        key={item.id}
                            track_selection={()=>{track_selection(item.id!)}}
                            item_data={item}
                            item_index={index} 
                            send_selected_ele={()=>{handle_callback_selected_entry(item)}}                    
                        />
                    )
                })}
            </div>

            <div id="cpv_btns" className="cp_utility_bar">
                <button id="cpv_add_btn" className="cp_utility_bar_btn general_btn"
                        onClick={()=>{handle_edit_btn_click({submit_method:"add", table_item:initial_form_data})}}
                > New </button>
                {entry_selected &&
                <button id="cpv_edit_btn" className="cp_utility_bar_btn general_btn"
                        onClick={()=>{handle_edit_btn_click({submit_method:"edit", table_item:selected_entry.current})}}
                > Edit  </button>
                }
                {entry_selected &&
                <button id="cpv_delete_btn" className="cp_utility_bar_btn general_btn"
                        onClick={()=>{handle_edit_btn_click({submit_method:"delete", table_item:selected_entry.current})}}
                > Delete  </button>
                }
                <Control_panel_sort_button />
                
            </div>
        </article>
    );

}

