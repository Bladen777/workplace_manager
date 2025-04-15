import axios from "axios";
import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react"

// COMPONENT IMPORTS

// CONTEXT IMPORTS 
import { Use_Context_table_info } from "./Context_db_table_info.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Types_form_data } from "./Context_db_table_info.js";

interface Types_context {
    update_func:{
        now:Function;
        wait:Function;
        update_context: Function;
    };
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
    order_direction?: string;
}

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = [{}];

// CONTEXT TO USE 
export const Use_Context_table_data = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_table_data({children}:{children:ReactNode}) {

    const context_section_name = useContext(Use_Context_table_info).show_context.table_name;
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);


    // UPDATE THE CONTEXT 
    async function update_context({ section_name, sort_field, filter_key, filter_item, order_key, order_direction }:Types_context_function = {}){
        if(!section_name){section_name = context_section_name};
        console.log(`%c CONTEXT UPDATE `, `background-color:${log_colors.context}`, `change table data to be from`,section_name, `${order_key !== undefined ? (`by order of, ${order_key}, ${order_direction}`) : ""}` );
       
        try {
            const response = await axios.post("/get_table_info",{
                table_name: section_name,
                sort_field: sort_field,
                filter_key: filter_key,
                filter_item: filter_item,
                order_key: order_key,
                order_direction: order_direction
            })
            const data = response.data;
            console.log(`   %c CONTEXT DATA `, `background-color:${ log_colors.data }`,`for get_table_data & ${section_name} `, '\n' , data);
            return(data);
        } catch (error) {
            console.log(`%cError getting Table info: `, 'background-color:darkred', error); 
        }
      
    }

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_table_data.Provider value={{
            update_func:{
                now:async (props:Types_context_function)=>{set_send_context(await update_context(props))},
                wait:update_context,
                update_context:set_send_context 
            },
            show_context:send_context}}
        > 
            {children} 
        </Use_Context_table_data.Provider> 
    );
}