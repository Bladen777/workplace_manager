import { useContext } from "react";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";

// TYPE DEFINITIONS 
import { Types_column_info } from "../../context/Context_db_table_info.js";
import { Types_form_data } from "../../context/Context_db_table_info.js";

// LOG STYLES
import { log_colors } from "../../../../styles/_log_colors.js";

export interface Types_new_entry{
    table_data: Types_form_data;
    send_table_data: Function;
}


export default function Edit_control_panel_entry({table_data, send_table_data}:Types_new_entry) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`,`for Edit_control_panel_entry`);
    console.log(`   %c DATA `, `background-color:${ log_colors.data }`,`for table_data`,'\n' ,table_data);

    const section_name = useContext(Use_Context_Section_Name).show_context;
    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    const initial_form_data = useContext(Use_Context_Table_Info).show_context.initial_form_data;

    // CREATE THE INPUTS FOR THE FORM BASED ON DATABASE COLUMN NAMES
    function create_inputs(item: Types_column_info, index:number) {
        const item_name:string = item.column_name;
        const input_type = item.input_type;
        const item_string = item_name.replace("_"," ");
        const form_value = table_data[item_name] ? table_data[item_name] : "";
        if(input_type !== "order"){
        return(
            <div className="cpe_form_input"  key={index}>
                <p>{item_string}</p>
                <input
                type={input_type}
                placeholder={item_string}
                value={form_value}
                name={item_name}
                onChange={(e)=>{send_table_data({...table_data, [item_name]: e.target.value})}}
                />
      
            </div>
        )
        }
    }
        return(

            <form id="cpe_form">
                {db_column_info.map(create_inputs)}
            </form>
        )
    

}
