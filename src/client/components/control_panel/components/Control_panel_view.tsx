import { useCallback, useContext, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS
import Control_panel_sort_button from "./control_panel_view/Control_panel_sort_button.js";
import Control_panel_entry from "./control_panel_view/Control_panel_entry.js";

// CONTEXT IMPORTS
import { Use_Context_initial_data } from "../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../context/Context_active_entry.js";
import { Use_Process_input_data } from "../../_universal/Process_input_data.js";

// HOOK IMPORTS

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";
import "../../../styles/control_panel/cp_view.css"

// TYPE DEFINITIONS 
import { Types_form_data } from "../../context/Context_initial_data.js";


interface Types_entries{
    is_active:boolean;
    data:Types_form_data;
}

interface Types_selected_entry{
    index:number;
    data:Types_form_data;
}

interface Types_props{
    active_table:string;
    open_edit: Function;
}



// THE COMPONENT
export default function Control_panel_view({open_edit, active_table}:Types_props) {

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const process_data = useContext(Use_Process_input_data);

    const update_active_entry = useContext(Use_Context_active_entry).update_func;
    
    const [entries, set_entries] = useState<Types_entries[]>([]);
    const [status_message, set_status_message] = useState<string>("");

 

    console.log(`%c SUB-COMPONENT `, `${log_colors.sub_component}`, `Control_panel_view for`, active_table, "\n", initial_data);

    const [entry_selected, set_entry_selected] = useState<boolean>(false);
    const selected_entry = useRef<Types_selected_entry | null>(null);

    async function handle_edit_btn_click({submit_method}:{submit_method:string}){
        if (submit_method === "delete" ){
            const item_id = selected_entry.current!.data.id;
            const response:string = await process_data.delete_entry({table_name:active_table, item_id:item_id}); 
            set_status_message(response);
            return
        } else if(submit_method === "add"){
            await update_active_entry.now({submit_method:submit_method})
        } else if (submit_method === "edit"){
            await update_active_entry.now({submit_method:submit_method, target_id: selected_entry.current?.data.id})
        } 
        open_edit()
    }

    const handle_callback_selected_entry = useCallback(({item, index}:{item:Types_form_data, index:number})=>{
        handle_selected_entry(item, index);
    },[entry_selected]);

    function handle_selected_entry(item:Types_form_data, index:number){
        console.log(`%c DATA `, `${ log_colors.data }`,`for item`,'\n' ,item, '\n' ,`for index: ${index}` );
        if(!entry_selected){
            set_entry_selected(true);
        }
        console.log(`%c DATA `, `${ log_colors.data }`,`for entry_selected`,'\n' ,entry_selected);

        // Find previous selected entry and set is_active to false
        const prev_entry_index = {...selected_entry.current}.index;
        set_entries((prev_vals)=>{
            const update_data = [...prev_vals]
            console.log(`%c DATA `, `${ log_colors.data }`,`for prev_entry_index`,'\n' ,prev_entry_index);
            if(entry_selected){
                update_data[prev_entry_index!].is_active = false;
            }
            update_data[index].is_active = true;
            return update_data;
        });
        selected_entry.current = {data:item, index:index};
    };

// MEMOS AND EFFECTS    

useMemo(()=>{
    set_entries(()=>{
        const initial_entries:Types_entries[] = initial_data[active_table].data.map((item:Types_form_data)=>{
            return{
                is_active:false,
                data:item
            }
        })
        return initial_entries
    })
    
    selected_entry.current = null;
    set_entry_selected(false);
    set_status_message("")
},[active_table]);


// RETURNED VALUES
    return (
        <article id="control_panel_views" className="control_panel_action_box">
            <div id="cpv_entry_box" className="cp_content_box">
            {entries.map(({is_active, data}:Types_entries , index)=>{
                    return(
                        <Control_panel_entry
                            key={data.id}
                            is_active = {is_active}
                            active_table = {active_table}
                            item_data={data}
                            item_index={index} 
                            send_selected_ele={handle_callback_selected_entry}                    
                        />
                    )
                })}
            </div>

            <div id="cpv_btns" className="cp_utility_bar">
                <button id="cpv_add_btn" className="cp_utility_bar_btn general_btn"
                        onClick={()=>{handle_edit_btn_click({submit_method:"add"})}}
                > 
                    <h4>New</h4> 
                </button>
                {entry_selected &&
                <button id="cpv_edit_btn" className="cp_utility_bar_btn general_btn"
                        onClick={()=>{handle_edit_btn_click({submit_method:"edit"})}}
                > 
                    <h4>Edit</h4>  
                </button>
                }
                {entry_selected &&
                <button id="cpv_delete_btn" className="cp_utility_bar_btn general_btn"
                        onClick={()=>{handle_edit_btn_click({submit_method:"delete"})}}
                > 
                    <h4>Delete</h4>  
                </button>
                }
                {status_message !== "" &&
                    <h3>{status_message}</h3>
                }
                <Control_panel_sort_button 
                    active_table = {active_table}
                />
                
            </div>
        </article>
    );

}

