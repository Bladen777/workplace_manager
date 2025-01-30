import { useContext} from "react";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";

// TYPE DEFINITIONS 
import { Types_column_info } from "../context/Context_db_table_info.js";
import { Types_form_data } from "../context/Context_db_table_info.js";



export default function Control_panel_entries({table_item}:{table_item:Types_form_data}) {
    const section_name = useContext(Use_Context_Section_Name).show_context;
    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    console.log(`%cControl_panel_entries Called for ${section_name}`, 'background-color:darkorchid');
    console.log("table_item: ", table_item);

        let entry_name;
        const entry_item = db_column_info.map((item:Types_column_info, table_index:number) => {
            const column_name: string = item.column_name;
       
            if(column_name.includes("name")){
                entry_name = table_item[column_name];
            } else if(column_name.includes("color")){
                return(<div key={table_index} className="color_id" style={{backgroundColor:`${table_item[column_name]}`}}></div>)
            } else if(column_name.includes("order")){
                return
            } else {
                return(<p key={table_index}>{table_item[column_name]}</p>)
            };
        });

        return(
            <div className="control_panel_entry">
                <h3>{entry_name}</h3>
                {entry_item}
            </div>
        ); 
      
}
