import { useRef, useEffect, useState } from "react";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_entry_input } from "./Control_panel_input.js";

interface Types_props{
    send_table_data: Function;
    item_data: Types_entry_input;
}

// THE COMPONENT 
export default function Money_input({send_table_data, item_data}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `money_input`);

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
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for decimal_pos`,'\n' ,decimal_pos);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for chars`,'\n' ,chars);
        
        // ADJUST RIGHT SIDE
        if(chars.right.length > 2){
            if(input_cursor_pos.current === input.length){
                chars.right = chars.right.slice(1);
            }else if(input_cursor_pos.current - (chars.left.length +2) === 0){
                chars.right = chars.right.slice(0,1) + chars.right.slice(2);
            }else{
                chars.right = chars.right.slice(0,2);
            }
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for adjust right side`,'\n' ,chars.right);
        } else if(chars.right.length < 2){
            const missing_digits = 2 - chars.right.length;
            chars.right = chars.right + ("0".repeat(missing_digits));
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for missing right side`,'\n' ,chars.right);
        } else {
            //ADJUST LEFT SIDE
            if(chars.left.length === 0){
                chars.left = "0"
                console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for missing left side`,'\n' ,chars.left);
            } else if (chars.left.startsWith("0") && chars.left.length > 1){
                chars.left = chars.left.slice(1)
                if(chars.left.length === 1){
                    input_cursor_pos.current = input_cursor_pos.current -1;
                }
                console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for remove zero left side`,'\n' ,chars.left);
            }        
        }

        input = chars.left + "." + chars.right
        return input;
    }

    function input_change({input, db_column}:{input:string, db_column:string}){
        if(db_column !== "pay_type"){
            input = format_money(input);
        }
        send_table_data({input: input, db_column: db_column})
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for change finished`);
    }


    function input_option(){
        if(item_data.name === "pay_rate"){
            return(
                <div className="input_option">
                    <input
                        id="hourly_pay"
                        name="pay_type"
                        value="Hourly"
                        type="radio"
                        onChange={(e)=>{input_change({input:e.target.value, db_column:"pay_type"})}}
                    />
                    <label htmlFor="hourly_pay">Hourly</label>

                    <input
                        id="annual_pay"
                        name="pay_type"
                        value="Annually"
                        type="radio"
                        onChange={(e)=>{input_change({input:e.target.value, db_column:"pay_type"})}}
                    />
                    <label htmlFor="annual_pay">Annually</label>
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
        <div className="cpe_form_input" >
            <label htmlFor={item_data.name}>{item_data.name_text}</label>
            <input
                ref = {money_input_ref}
                id={item_data.name}
                name={item_data.name}
                type={item_data.input_type}
                placeholder={item_data.name_text}
                autoComplete="off"
                value={item_data.value}
        
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                    input_cursor_pos.current = e.target.selectionStart!;
                    input_change({input:e.target.value, db_column:item_data.name})
                    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for change detected`);
                }}
                onFocus={()=>{
                    input_cursor_pos.current = 1;
                    setTimeout(() => {
                        set_focus_input(true);
                    },1)
                }}
            />

            {input_option()}
        </div>
    )

}