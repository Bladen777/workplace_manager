import { useContext} from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";

// HOOK IMPORTS

// COMPONENT IMPORTS

// TYPE DEFINITIONS 
import { Types_column_info } from "../../../context/Context_initial_data.js";
import { Types_form_data } from "../../../context/Context_initial_data.js";


interface Types_props{
    table_item: Types_form_data;
    item_index: number;
    active_table: string;
}

// THE COMPONENT
export default function Control_panel_entry_data({table_item, item_index, active_table}:Types_props) {
    const db_column_info = useContext(Use_Context_initial_data).show_context[active_table].info.db_column_info;
    console.log(`       %c SUB_COMPONENT `, `${ log_colors.sub_component }`,`for control_panel_entry_data`,'\n         ' ,table_item);

        let entry_name;
        const entry_item = db_column_info.map((item:Types_column_info, table_index:number) => {
            const column_name: string = item.column_name;
            const column_name_text:string = convert_text()
            function convert_text(){
                let text = item.column_name.replaceAll("_"," ")
                const first_letter = text.slice(0,1).toUpperCase();
                text = first_letter + text.slice(1);
                return text;
            }
            if(column_name.includes("name")){
                entry_name = table_item[column_name];
            } else if(column_name.includes("color")){
                return(<div key={table_index} className="color_id" style={{backgroundColor:`${table_item[column_name]}`}}></div>)
            } else if(column_name.includes("order")){
                return
            } else if(column_name.includes("pay_type")){
                return
            } else if(column_name.includes("admin")){
                return(<p key={table_index}>{`${column_name_text}: ${table_item.admin === "1" ? "Yes" : "No"}`}</p>)
            } else if(column_name.includes("pay_rate")){
                return(<p key={table_index}>{`${column_name_text}: $${table_item[column_name]} ${table_item.pay_type}`}</p>)
            } else if(column_name.includes("part_time")){
                return(<p key={table_index}>{`${column_name_text}: ${table_item.part_time === "1" ? "Yes" : "No" }`}</p>)                       
            } else { 
                return(<p key={table_index}>{`${column_name_text}: ${table_item[column_name]}`}</p>)
            };
        });

// MEMOS AND EFFECTS

// RETRURNED VALUES        
    return(
        <>
            <h3>{`${item_index}. ${entry_name}`}</h3>
            {entry_item}
        </>
    ); 
      
}
