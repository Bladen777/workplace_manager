import axios from "axios";
import { createContext, useContext, useState, ReactNode } from "react"

// CONTEXT IMPORTS
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";
import { Use_Context_Section_Name } from "./Context_section_name.js";

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../context/Context_db_table_info.js";


  interface Types_context{
    update_func:Function,
    show_context: Types_form_data[]
}

export interface Types_get_table_data {
    sort_field?: string;
    filter_key?: string;
    filter_item?: string | number;
    order_key?: string;
}



const initial_table_data = [{}];

// The Value to use
export const Use_Context_Table_Data = createContext<Types_context>({update_func:()=>{},show_context:initial_table_data});

// The Component returned 
export function Provide_Context_Table_Data({children}:{children:ReactNode}) {

    const section_name = useContext(Use_Context_Section_Name).show_context;
    const [form_data, set_form_data] = useState<Types_form_data[]>([]);
    const db_column_names = useContext(Use_Context_Table_Info).show_context.db_column_info.map((item)=>item.column_name);

    // change order key based on section name if no order key was specified
    function find_order_id_key(order_key: string | undefined){
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
    
    // GET EXISTING FORM INFORMATION FROM THE DATABASE AND ADD IT TO THE FORM
    async function get_form_info({sort_field, filter_key, filter_item, order_key }:Types_get_table_data){
        const order_id_key:string = find_order_id_key(order_key);
        console.log(`%c CONTEXT UPDATE `, `background-color:${log_colors.context}`, `change table data be from `,section_name);
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
            set_form_data(data);
            
        } catch (error) {
            console.log(`%cError getting Table info: `, 'background-color:darkred', error); 
        }
    };

    
  return (
    <Use_Context_Table_Data.Provider value={{update_func:get_form_info, show_context: form_data }}>
        {children}
    </Use_Context_Table_Data.Provider>
  )
}