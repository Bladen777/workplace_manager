import { useContext, useEffect, useRef, useState } from "react";

// CUSTOM HOOKS
import useGetTableData from "./hooks/useGetTableData.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_view as Prop_types} from "../control_panel.js"

import { Types_column_info } from "../context/Context_db_table_info.js";

// THE COMPONENT
export default function Control_panel_view({item_id}:Prop_types) {
    

    const section_name = useContext(Use_Context_Section_Name).show_context;
    console.log(`%cControl_panel_view Called for ${section_name}`, 'background-color:darkorchid');

    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;

    const table_data = useGetTableData({section_name: section_name, order_item:"id"});

    function populate_view(table_item:any, index:number){
        let entry_name;
        const entry_item = db_column_info.map((item:Types_column_info, index:number) => {
            const column_name = item.column_name;
       
            if(column_name.includes("name")){
                entry_name = table_item[column_name]
            } else if(column_name.includes("color")){
                return(<div key={index} className="color_id" style={{backgroundColor:`${table_item[column_name]}`}}></div>)
            } else{
                return(<p key={index}>{table_item[column_name]}</p>)
            }
        })  

        return(
            <figure className={index % 2 === 0 ? "cpv_entry" : "cpv_entry cpv_entry_odd" }
                        key={index}
                        onClick={()=>{item_id(table_item.id)}}
            >
                <h3>{entry_name}</h3>
                {entry_item}
            </figure>
        ) 
      }

    
        return(
            <div>
                {table_data &&
                table_data.map(populate_view)
                }
            </div>
        )
}