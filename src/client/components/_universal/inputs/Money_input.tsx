import { useRef, useEffect, useState } from "react";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_entry_input } from "./Form_auto_input.js";
import { Types_input_change } from "./Form_auto_input.js";

interface Types_props{
    item_data: Types_entry_input;
    pay_type_value?: string | number;
    send_table_data: Function;
}

// THE COMPONENT 
export default function Money_input({send_table_data, pay_type_value, item_data}:Types_props) {
    console.log(`       %c MONEY INPUT `, `background-color:${ log_colors.input_component }`, `for`, item_data);

    // ENSURE PROPER CURSOR POSITION WHILE ADJUSTING NUMBERS
    const [focus_input, set_focus_input] = useState<Boolean>(false);
    const money_input_ref = useRef<HTMLInputElement | null>(null);
    const input_cursor_pos = useRef<number>(1);

    // FORMAT THE MONEY AMOUNT CORRECTLY
    function format_money(input:string){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for starting_input`,'\n', input);
        
        // REMOVE NON-NUMBER CHARACTERS
        function fix_numbers(characters:string){
            const number_check = /[^0-9]/
            let fixed_input:string = "";
            characters.split("").forEach((char)=>{
                if(!number_check.test(char)){
                    fixed_input += char;
                } else {
                }
            });
            return fixed_input;
        }
        

        // CHECK DECIMAL
        if(!input.includes(".")){
            input = input.slice(0,-2) + "." + input.slice(-2);
        };
        const decimal_pos = input.indexOf(".");

        // SET LEFT AND RIGHT SIDES OF INPUT, AND REMOVE ANY NON-NUMBERS
        const chars:{left:string | string[], right:string | string[]} = {left:"", right:""};
        chars.left = fix_numbers(input.slice(0, decimal_pos));
        chars.right = fix_numbers(input.slice(decimal_pos + 1));
        //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for decimal_pos`,'\n' ,decimal_pos);
        //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for chars`,'\n' ,chars);
        
        // ADJUST RIGHT SIDE
        if(chars.right.length > 2){
            if(input_cursor_pos.current === input.length){
                chars.right = chars.right.slice(1);
            }else if(input_cursor_pos.current - (chars.left.length +2) === 0){
                chars.right = chars.right.slice(0,1) + chars.right.slice(2);
            }else{
                chars.right = chars.right.slice(0,2);
            }
            //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for adjust right side`,'\n' ,chars.right);
        } else if(chars.right.length < 2){
            const missing_digits = 2 - chars.right.length;
            chars.right = chars.right + ("0".repeat(missing_digits));
            //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for missing right side`,'\n' ,chars.right);
        } else {
            //ADJUST LEFT SIDE
            if(chars.left.length === 0){
                chars.left = "0"
                //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for missing left side`,'\n' ,chars.left);
            } else if (chars.left.startsWith("0") && chars.left.length > 1){
                chars.left = chars.left.slice(1)
                if(chars.left.length === 1){
                    input_cursor_pos.current = input_cursor_pos.current -1;
                }
                //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for remove zero left side`,'\n' ,chars.left);
            }        
        }

        input = chars.left + "." + chars.right
        return input;
    }

    function handle_input_change({input, db_column}:Types_input_change){
        if(db_column !== "pay_type"){
            input = format_money(input);
        }
        send_table_data({input: input, db_column: db_column})
    }


    function input_option(){
        if(item_data.name === "pay_rate"){
            return(
                <div className="input_option">
                    <label className="auto_form_input_label">
                        <input
                            id="hourly_pay"
                            className="auto_form_radio"
                            name="pay_type"
                            value="hourly"
                            type="radio"
                            checked = {pay_type_value === "hourly" ? true : false}
                            onChange={(e)=>{handle_input_change({input:e.target.value, db_column:"pay_type"})}}
                        />
                    {" "}Hourly</label>

                    <label className="auto_form_input_label">
                        <input
                            id="annual_pay"
                            className="auto_form_radio"
                            name="pay_type"
                            value="annually"
                            type="radio"
                            checked = {pay_type_value === "annually" ? true : false}
                            onChange={(e)=>{handle_input_change({input:e.target.value, db_column:"pay_type"})}}
                        />
                    {" "}Annually</label>
                </div>
            )
        } else {
            return
        }
    }

    useEffect(() =>{
        const cursor_pos:number = input_cursor_pos.current !== -1 ? input_cursor_pos.current : 0;
        money_input_ref.current?.setSelectionRange(cursor_pos, cursor_pos);
    })
    
    // RETURNED VALUES 
    return(
        <div className="auto_form_input" >
            <label className="auto_form_input_label">
                <p>{item_data.name_text}: </p>
                <input
                    ref = {money_input_ref}
                    id={item_data.name}
                    className={`auto_form_${item_data.input_type}`}
                    name={item_data.name}
                    type={item_data.input_type}
                    placeholder={item_data.name_text}
                    autoComplete="off"
                    value={item_data.value !== "" ? item_data.value : "0.00"}
            
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                        input_cursor_pos.current = e.target.selectionStart!;
                        handle_input_change({input:e.target.value, db_column:item_data.name})
                    }}
                    onFocus={()=>{
                        input_cursor_pos.current = 1;
                        setTimeout(() => {
                            set_focus_input(true);
                        },1)
                    }}
                />
            </label>

            {input_option()}
        </div>
    )

}