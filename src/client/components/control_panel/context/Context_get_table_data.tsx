import axios from "axios";
import { createContext, useContext, useState, ReactNode } from "react"

// COMPONENT IMPORTS

// CONTEXT IMPORTS 
import { Use_Context_Table_Info } from "./Context_db_table_info.js";
import { Use_Context_Section_Name } from "./Context_section_name.js";

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Types_form_data } from "./Context_db_table_info.js";

interface Types_context {
    update_func:Function;
    show_context:Types_context_content; 
};

interface Types_context_content extends Array<Types_form_data>{};
interface Types_context_function extends Types_get_table_data{};

export interface Types_get_table_data {
    section_name?: string;
    sort_field?: string;
    filter_key?: string;
    filter_item?: string | number;
    order_key?: string;
}

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = [{}];

// CONTEXT TO USE 
export const Use_Context_Table_Data = createContext<Types_context>({update_func:()=>{}, show_context:initial_context_content })

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_Table_Data({children}:{children:ReactNode}) {
    const db_column_names = useContext(Use_Context_Table_Info).show_context.db_column_info.map((item)=>item.column_name);
    const context_section_name = useContext(Use_Context_Section_Name).show_context;
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    // FIND THE CORRECT NAME FOR THE ORDER KEY
    function find_order_id_key(section_name:string ,order_key: string | undefined){
        let key:string = "id";

        if(!order_key){
        switch (section_name) {
            case "departments":
                key = "order";
                break;
            default:
                break; 
        }}else{
            key = order_key;
        }

        db_column_names.find((key_name)=>{


            if(key_name.includes(key)){
                key = key_name;
            } 
        });
        return key;     
}


    // UPDATE THE CONTEXT 
    async function update_context({ section_name, sort_field, filter_key, filter_item, order_key }:Types_context_function = {}){
        if(!section_name){section_name = context_section_name};
        const order_id_key:string = find_order_id_key(section_name, order_key);
        console.log(`%c CONTEXT UPDATE `, `background-color:${log_colors.context}`, `change table data be from`,section_name, `by order of`, order_id_key);
        try {
            const response = await axios.post("/get_table_info",{
                table_name: section_name,
                sort_field: sort_field,
                filter_key: filter_key,
                filter_item: filter_item,
                order_key: order_id_key
            })
            const data = response.data;
            console.log(`   %c CONTEXT DATA `, `background-color:${ log_colors.data }`,`for ${section_name} `, '\n' , data);
            set_send_context(data);
            
        } catch (error) {
            console.log(`%cError getting Table info: `, 'background-color:darkred', error); 
        }
      
    }

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_Table_Data.Provider value={{update_func:update_context, show_context:send_context}}>
            {children} 
        </Use_Context_Table_Data.Provider> 
    );
}