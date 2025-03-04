import { ChangeEvent, useContext, useEffect, useMemo, useRef, useState } from "react";

// COMPONENT IMPORTS
import Money_input from "./Money_input.js";

// CONTEXT IMPORTS
import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";
import { Use_Context_current_table_item } from "../../context/Context_current_table_item.js";

// TYPE DEFINITIONS 
import { Types_column_info } from "../../context/Context_db_table_info.js";
import { Types_form_data } from "../../context/Context_db_table_info.js";

// LOG STYLES
import { log_colors } from "../../../../styles/_log_colors.js";


export interface Types_new_entry{
    column_info: Types_column_info;
    table_data_object?: Types_form_data;
    send_table_data: Function;
}

export interface Types_entry_input{
    name: string;
    input_type: string;
    name_text: string;
    value: string | number | undefined; 
}

export interface Types_input_change{
    input:string;
    db_column:string;
}


export default function Control_panel_input({column_info, table_data_object, send_table_data}:Types_new_entry) {

    let current_table_data:Types_form_data = useContext(Use_Context_current_table_item).show_context.current_table_item;
    if(table_data_object){current_table_data = table_data_object}
    const [input_data, set_input_data] = useState<Types_form_data>(current_table_data);

    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`,`for Control_panel_input for ${column_info.column_name}`, "\n",   input_data);

        function convert_text(){
            let text = column_info.column_name.replaceAll("_"," ")
            const first_letter = text.slice(0,1).toUpperCase();
            text = first_letter + text.slice(1);
            return text;
        }

        const item_data: Types_entry_input ={
            name: column_info.column_name,
            input_type: column_info.input_type,
            name_text: convert_text(),
            value: input_data[column_info.column_name] ? input_data[column_info.column_name] : ""
        }

        // HANDLE INPUTS AND MODIFY DATA ACCORDINLY BEFORE SENDING
        function handle_input_change({input, db_column}:Types_input_change){
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for input`,'\n' ,input);
            set_input_data({...input_data, [db_column]: input})
            send_table_data({input: input, db_column:db_column})
        }
      
  
        if(item_data.input_type === "order" ) {
            return
        }else if (item_data.name === "pay_type") {
            return         
        } else if (item_data.name === "pay_rate") {
            return(
                <Money_input 
                    item_data = {item_data}
                    pay_type_value = {input_data.pay_type}
                    send_table_data = {handle_input_change}
                    key={`input_for_${item_data.name}`}
                />
            )
        } else {
            return(
                <div className="cpe_form_input" >
                    <label className="cpe_input_label">
                        <p>{item_data.name_text}:</p>   
                        <input
                            id={item_data.name}
                            className={`cpe_${item_data.input_type}`}
                            name={item_data.name}
                            type={item_data.input_type}
                            placeholder={item_data.name_text}
                            value={item_data.value ===  null ? "" : item_data.value}
                            checked = {(item_data.input_type === "checkbox" && item_data.value === "1") ? true : false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                                let value = e.target.value;
                                if(item_data.input_type === "checkbox"){
                                    if(e.target.checked){
                                        value="1"
                                    } else { 
                                        value="0"
                                    }
                                }
                                handle_input_change({input:value, db_column:item_data.name})
                            }}
                        />
                    </label>
        
                </div>
            )
            }
        }


