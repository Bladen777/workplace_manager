import { ChangeEvent, useContext, useMemo, useRef, useState } from "react";

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
    //console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`,`for Edit_control_panel_entry`, "\n",   table_data);

    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    const [current_table_data, set_current_table_data] = useState<Types_form_data>(table_data);
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`,`for Edit_control_panel_entry`, "\n",   current_table_data);


     
    // FORMAT THE MONEY AMOUNT CORRECTLY
    function format_money(input:string){
       
        // REMOVE CHARACTERS IF IT'S NOT A NUMBER
        function input_numbers(){
            const chars:{front:string | string[], back:string | string[]} = {front: input, back:""};
            
            function fix_numbers(characters:string){
                const number_check = /[^0-9]/
                let fixed_input:string = "";
                characters.split("").forEach((char)=>{
                    if(!number_check.test(char)){
                        fixed_input += char;
                    }
                });
                return fixed_input;
            }

            if(input.at(-4) === "."){
                chars.front = input.slice(0,-4);
                chars.back = fix_numbers(input.slice(-3));
            } else if (input.at(-3) === "."){
                chars.front = fix_numbers(input.slice(0,-3));
                chars.back =  input.slice(-2);
            }

            input = chars.front + "." + chars.back;
            console.log(`%c important `, `background-color:${ log_colors.important }`,`for fixed numbers`,'\n' ,input);
        }
        if(input.at(-4) === "." || input.at(-3) === "."){
            input_numbers();
        }
        

        // FORMAT THE DECIMAL AND TRAILING ZEROS PROPERLY
        const trailing_chars = input.slice(-3);
        
        if(trailing_chars.includes(".")){
            const decimal = trailing_chars.indexOf(".")
            switch (decimal){
                case 1:
                    input = input + "0"
                    break;
                case 2:
                    input = input + "00"
                    break;
                default:
                    break; 
            }
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`${decimal !== 0 ? "for no trailing zeros, decimal pos:" : "decimal is fine"} `,input)
        } else if(input.at(-4) === ".") {
            const start = input.slice(0, -4) + input.slice(-3, -3)
            const end = input.slice(-2);
            input = start + "." + end;
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for cents value`, input)
        } else {
            const start = input.slice(0, -2)
            const end = input.slice(-2);
            input = start + "." + end;
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for decimal missing`, input)
        };

        // FIX STARTING ZEROS
        if(input.at(-3) === "."){
            const starting_chars = input.slice(0,-3);
            if(starting_chars.startsWith("0") && starting_chars.length > 2){
                input = starting_chars.slice(1) + trailing_chars; 
            }
        }

        return input
    }
    

    // CREATE THE INPUTS FOR THE FORM BASED ON DATABASE COLUMN NAMES
    function create_inputs(item: Types_column_info, index:number) {
        const item_name:string = item.column_name;
        const input_type = item.input_type === "money" ? "text" : item.input_type;
        const item_string = item_name.replace("_"," ");
        const form_value = current_table_data[item_name] ? current_table_data[item_name] : "";

        // HANDLE INPPUTS AND MODIFY DATA ACCORDINLY BEFORE SENDING
        function input_change(event: React.ChangeEvent<HTMLInputElement>){
            let input:string = event.target.value;

            if(item.input_type === "money"){
                input = format_money(event.target.value);
            }

            send_table_data({...current_table_data, [item_name]: input})
            set_current_table_data({...current_table_data, [item_name]: input})
        }
      
  
        if(input_type !== "order"){
            return(
                <div className="cpe_form_input"   key={index}>
                    <p>{item_string}</p>
                    <input
                    type={input_type}
                    placeholder={item_string}
                    value={form_value}
                    name={item_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                        input_change(e)
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
