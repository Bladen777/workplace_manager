import { useContext} from "react";

// CONTEXT IMPORTS
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";

// TYPE DEFINITIONS 
import { Types_column_info } from "../context/Context_db_table_info.js";
import { Types_form_data } from "../context/Context_db_table_info.js";


// THE COMPONENT
export default function Control_panel_entries({table_item}:{table_item:Types_form_data}) {
    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;

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
            <>
                <h3>{entry_name}</h3>
                {entry_item}
            </>
        ); 
      
}
