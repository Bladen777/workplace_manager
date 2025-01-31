import { useContext } from "react";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";

// TYPE DEFINITIONS 
import { Types_column_info } from "../../context/Context_db_table_info.js";
import { Types_form_data } from "../../context/Context_db_table_info.js";

interface Prop_types{
    form_data: Types_form_data;
    send_form_data: Function;
}

export default function New_control_panel_entry({form_data, send_form_data}:Prop_types) {

    const section_name = useContext(Use_Context_Section_Name).show_context;
    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;

    // CREATE THE INPUTS FOR THE FORM BASED ON DATABASE COLUMN NAMES
    function create_inputs(item: Types_column_info, index:number) {
        const item_name:string = item.column_name;
        const input_type = item.input_type;
        const item_string = item_name.replace("_"," ");
        const form_value = form_data[item_name] ? form_data[item_name] : "";
        return(
            <div className="cpe_form_input"  key={index}>
                <p>{item_string}</p>
                <input
                type={input_type}
                placeholder={item_string}
                value={form_value}
                name={item_name}
                onChange={(e)=>{send_form_data({...form_data, [item_name]: e.target.value})}}
                />
      
            </div>
        )
    }
        return(

            <form id="cpe_form">
                {db_column_info.map(create_inputs)}
            </form>
        )
    

}
