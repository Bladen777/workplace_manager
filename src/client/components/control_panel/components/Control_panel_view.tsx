import { useContext, useEffect } from "react";

// COMPONENT IMPORTS
import Control_panel_entries from "./Control_panel_entries.js";

// CUSTOM HOOKS
import useGetTableData from "./hooks/useGetTableData.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../context/Context_section_name.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_view as Prop_types} from "../Control_panel.js"
import { Types_form_data } from "../context/Context_db_table_info.js";

// THE COMPONENT
export default function Control_panel_view({item_id, view_order_key}:Prop_types) {
    const section_name = useContext(Use_Context_Section_Name).show_context;
    console.log(`%cControl_panel_view Called for ${section_name}`, 'background-color:darkorchid');

    const table_data = useGetTableData({section_name: section_name, order_key:view_order_key});

    return(
        <div>
            {table_data &&
            table_data.map((item:Types_form_data, index:number)=>{
                console.log("the item being sent: ", item);
                return(
                    <figure 
                        key={index} 
                        onClick={()=>{item_id(item.id)}}
                        className={index % 2 === 0 ? "cpv_entry" : "cpv_entry cpv_entry_odd"} 
                    >
                        <Control_panel_entries     
                            table_item = {item}
                        />
                    </figure>
                ) 
            })
            }
        </div>
    );
}