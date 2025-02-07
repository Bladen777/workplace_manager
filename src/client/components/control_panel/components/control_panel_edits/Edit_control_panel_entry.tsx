import { ChangeEvent, useContext, useEffect, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS
import Money_input from "./Money_input.js";

// CONTEXT IMPORTS
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

export interface Types_entry_input{
    name: string;
    input_type: string;
    name_text: string;
    value: string | number | undefined; 
}


export default function Edit_control_panel_entry({table_data, send_table_data}:Types_new_entry) {
    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    const [current_table_data, set_current_table_data] = useState<Types_form_data>(table_data);

    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`,`for Edit_control_panel_entry`, "\n",   current_table_data);

    // CREATE THE INPUTS FOR THE FORM BASED ON DATABASE COLUMN NAMES
    function create_inputs(item: Types_column_info, index:number) {

        function convert_text(){
            let text = item.column_name.replaceAll("_"," ")
            const first_letter = text.slice(0,1).toUpperCase();
            text = first_letter + text.slice(1);
            return text;
        }

        const item_data: Types_entry_input ={
            name: item.column_name,
            input_type: item.input_type,
            name_text: convert_text(),
            value: current_table_data[item.column_name] ? current_table_data[item.column_name] : ""
        }

        // HANDLE INPUTS AND MODIFY DATA ACCORDINLY BEFORE SENDING
        function input_change({input, db_column}:{input:string, db_column:string}){
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for input`,'\n' ,input);
            send_table_data({...current_table_data, [db_column]: input})
            set_current_table_data({...current_table_data, [db_column]: input})
        }
      
  
        if(item_data.input_type === "order" ) {
            return
        }else if (item_data.name === "pay_type") {
            return         
        } else if (item_data.name === "pay_rate") {
            return(
                <Money_input 
                    item_data = {item_data}
                    send_table_data = {input_change}
                    key={`input_for_${item_data.name}`}
                />
            )
        } else {
            return(
                <div 
                    className="cpe_form_input"   
                    key={`input_for_${item_data.name}`}
                >
                    <label htmlFor={item_data.name}>{item_data.name_text}</label>
                    <input
                    id={item_data.name}
                    name={item_data.name}
                    type={item_data.input_type}
                    placeholder={item_data.name_text}
                    value={item_data.value}
                   
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                        let value = e.target.value;
                        if(item_data.input_type === "checkbox"){
                            if(e.target.checked){
                                value="1"
                            } else {
                                value="0"
                            }
                        }
                        input_change({input:value, db_column:item_data.name})
                    }}
                    />
        
                </div>
            )
            }
        }

    return(
        <form className="cpe_form">
            {db_column_info.map(create_inputs)}
        </form>
    )
}
