import {memo, ReactElement, useContext, useEffect, useMemo, useState } from "react";

// COMPONENT IMPORTS
import Money_input from "./Money_input.js";

// CONTEXT IMPORTS
import { Use_Context_table_info } from "../../control_panel/context/Context_db_table_info.js";
import { Use_Context_current_table_item } from "../../control_panel/context/Context_current_table_item.js";

// HOOK IMPORTS

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Types_column_info } from "../../control_panel/context/Context_db_table_info.js";
import { Types_form_data } from "../../control_panel/context/Context_db_table_info.js";

export interface Types_new_entry{
    label_name?:string;
    column_info: Types_column_info;
    initial_data_object:Types_form_data;
    adjust_data_object?: Types_form_data;
    date_range?:{
        min?:string;
        max?:string;
    }
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

// THE COMPONENT
function Form_auto_input({label_name, column_info, initial_data_object, adjust_data_object, date_range, send_table_data}:Types_new_entry) {

 

    const [input_data, set_input_data] = useState<Types_form_data>(initial_data_object);
    const [input, set_input] = useState<ReactElement>();



        function convert_text(){
            let text = column_info.column_name.replaceAll("_"," ")
            const first_letter = text.slice(0,1).toUpperCase();
            text = first_letter + text.slice(1);
            return text;
        }

        const item_data: Types_entry_input ={
            name: column_info.column_name,
            input_type: column_info.input_type,
            name_text: label_name ? label_name : convert_text(),
            value: input_data[column_info.column_name] ? input_data[column_info.column_name] : ""
        }

        // HANDLE INPUTS AND MODIFY DATA ACCORDINLY BEFORE SENDING
        function handle_input_change({input, db_column}:Types_input_change){
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for input`,'\n' ,input);
            set_input_data({...input_data, [db_column]: input})
            send_table_data({input: input, db_column:db_column})
        }

        function create_inputs(){
            console.log(`       %c FORM AUTO INPUT `, `background-color:${ log_colors.input_component }`,`for ${item_data.name_text} is_nullable: ${column_info.is_nullable}`, `\n  `,   input_data);

            let input:ReactElement; 
            if(item_data.input_type === "order" ) {
                return
            }else if (item_data.name === "pay_type") {
                return         
            } else if (item_data.name === "pay_rate" || item_data.name.includes("budget")) {
                input = (
                    <Money_input 
                        item_data = {item_data}
                        pay_type_value = {input_data.pay_type}
                        send_table_data = {({input, db_column}:Types_input_change)=>{handle_input_change({input:input, db_column:db_column})}}
                        key={`input_for_${item_data.name}`}
                    />
                )
            } else {
                input = (
                    <label className="auto_form_input_label">
                        <p>{`${column_info.is_nullable === "NO" ? "* " : ""}${item_data.name_text}`}:</p>   
                        <input
                            id={item_data.name}
                            className={`auto_form_${item_data.input_type} auto_form_input`}
                            name={item_data.name}
                            type={item_data.input_type}
                            placeholder={item_data.name_text}
                            value={item_data.value ===  null ? "" : item_data.value}
                            checked = {(item_data.input_type === "checkbox" && item_data.value === "1") ? true : false}
                            min = {date_range && date_range.min}
                            max = {date_range && date_range.max}
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
                )
            }

            set_input(input)
        }

// MEMOS AND EFFECTS   
        
    useMemo(()=>{
        if(adjust_data_object){
            const key = column_info.column_name;
            if( input_data[key] !== adjust_data_object[key]){
                //console.log(`%c DATA `, `background-color:${ log_colors.data }`,` key: ${key}`,'\n',`for input_data:` ,input_data[key], ` vs `, `adjust_data_object: `, adjust_data_object[key]);
                set_input_data(adjust_data_object)
            }
        } else if(!adjust_data_object){
            set_input_data(
                initial_data_object
            )
        }
    },[adjust_data_object])

    useMemo(() =>{
        if(date_range){
            //console.log(`%c DATA `, `background-color:${ log_colors.data }`,'\n',`for input_data.date_range` ,input_data, ` vs `, `date_range: `, date_range);
            if(input_data.date_range === date_range){}
        }
        Object.keys(input_data).length > 0 && create_inputs()
    },[input_data, date_range])

        


/*
    useMemo(() =>{
        if(adjust_data_object){current_table_data = adjust_data_object}
        if(column_info.column_name){
            console.log(`%c FORM_AUTO_INPUT FIRST CREATION for ${column_info.column_name}`, `background-color:${ log_colors.important }`);
            create_inputs()
            return ()=>{console.log(`%c FORM_AUTO_INPUT UNLOADED for ${column_info.column_name}`, `background-color:${ log_colors.important_2 }`);}
        }
    },[])
*/



/*
    useEffect(() =>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for column_info`,'\n' ,column_info);
    },[column_info])

    useEffect(() =>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for adjust_data_object`,'\n' ,adjust_data_object);
    },[adjust_data_object])

    useEffect(() =>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for send_table_data`,'\n' ,send_table_data);
    },[send_table_data])
*/



// RETRURNED VALUES
        return (
            input
        )
}


export default memo(Form_auto_input) 