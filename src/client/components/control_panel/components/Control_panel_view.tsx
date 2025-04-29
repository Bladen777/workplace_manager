import { useCallback, useContext, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS
import Control_panel_sort_button from "./control_panel_view/Control_panel_sort_button.js";
import Control_panel_entry from "./control_panel_view/Control_panel_entry.js";

// CONTEXT IMPORTS
import { Use_Context_table_data } from "../context/Context_get_table_data.js";
import { Use_Context_table_info } from "../context/Context_db_table_info.js";
import { Use_Process_input_data } from "../../_universal/Process_input_data.js";

// HOOK IMPORTS

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/control_panel/cp_view.css"

// TYPE DEFINITIONS 
import { Types_form_data } from "../context/Context_db_table_info.js";

interface Types_entries{
    is_active:boolean;
    data:Types_form_data;
}

interface Types_selected_entry{
    index:number;
    data:Types_form_data;
}



// THE COMPONENT
export default function Control_panel_view({handle_edit_btn_click}:{handle_edit_btn_click:Function}) {
    const active_table = useContext(Use_Context_table_info).show_context.table_name;
    const initial_form_data = useContext(Use_Context_table_info).show_context.initial_form_data;
    const initial_table_data = useContext(Use_Context_table_data).show_context;
    const process_data = useContext(Use_Process_input_data);

    const update_table_data = useContext(Use_Context_table_data).update_func;

    const [entries, set_entries] = useState<Types_entries[]>(create_initial_entries());
    const [status_message, set_status_message] = useState<string>("");

    function create_initial_entries(){
        const initial_entries:Types_entries[] = initial_table_data.map((item:Types_form_data)=>{
            return{
                is_active:false,
                data:item
            }
        })
        return initial_entries
    }

    console.log(`%c SUB-COMPONENT `, `${log_colors.sub_component}`, `Control_panel_view for`, active_table, "\n", initial_table_data);

    const [entry_selected, set_entry_selected] = useState<boolean>(false);
    const selected_entry = useRef<Types_selected_entry | null>(null);

    useMemo(()=>{
        set_entry_selected(false);
        selected_entry.current = null;
        set_entries(create_initial_entries());
        set_status_message("")
    },[active_table]);

    useMemo(()=>{
        set_entry_selected(false);
        selected_entry.current = null;
        set_entries(create_initial_entries());
    },[initial_table_data])


    const handle_callback_selected_entry = useCallback(({item, index}:{item:Types_form_data, index:number})=>{
        handle_selected_entry(item, index);
    },[entry_selected]);

    function handle_selected_entry(item:Types_form_data, index:number){
        if(!entry_selected){
            set_entry_selected(true);
        }
        
        // Find previous selected entry and set is_active to false
        set_entries((prev_vals)=>{
            const prev_entry = {...selected_entry.current! }
            const update_data = [...prev_vals]
            if(entry_selected){
                update_data[prev_entry.index].is_active = false;
            }
            update_data[index].is_active = true;
            return update_data;
        });
        selected_entry.current = {data:item, index:index};
    };

    async function handle_delete_entry(){
        const item_id = selected_entry.current!.data.id;
        const response:string = await process_data.delete_entry({section_name: "control_panel", table_name:active_table, item_id:item_id}); 
        await update_table_data.now();
        set_status_message(response);
    }


// MEMOS AND EFFECTS    

// RETURNED VALUES
    return (
        <article id="control_panel_views" className="control_panel_action_box">
            <div id="cpv_entry_box" className="cp_content_box">
            {entries.map(({is_active, data}:Types_entries , index)=>{
                    return(
                        <Control_panel_entry
                            key={data.id}
                            is_active = {is_active}
                            item_data={data}
                            item_index={index} 
                            send_selected_ele={handle_callback_selected_entry}                    
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
                        onClick={()=>{handle_edit_btn_click({submit_method:"edit", table_item:selected_entry.current?.data})}}
                > Edit  </button>
                }
                {entry_selected &&
                <button id="cpv_delete_btn" className="cp_utility_bar_btn general_btn"
                        onClick={()=>{handle_delete_entry()}}
                > Delete  </button>
                }
                {status_message !== "" &&
                    <h3>{status_message}</h3>
                }
                <Control_panel_sort_button />
                
            </div>
        </article>
    );

}

