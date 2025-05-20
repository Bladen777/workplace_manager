import { createContext, useContext, useState, ReactNode, useRef, useMemo } from "react"
import axios from "axios";

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS 
interface Types_context {
    update_func:{ 
        now:Function;
        wait:Function;
        update_context:Function;
    };
    change_order: Function; 
    show_context:Types_context_content; 
};

export interface Types_form_data{
    id?:number;
   [key:string]: string | number | undefined;
}

export interface Types_column_info{
    column_name: string;
    is_nullable: string;
    input_type: string;
  };

  interface Types_form_info{
    db_column_info: Types_column_info[];
    form_data: Types_form_data;
  }

export interface Types_get_table_data {
    active_table?: string;
    sort_field?: string;
    filter_key?: string;
    filter_item?: string | number;
    order_key?: string;
    order_direction?: string;
}


interface Types_context_content {
    [key:string]:{
        info: Types_form_info;
        data:Types_form_data[]; 
    }    
};

interface Types_context_function {   
    table_name: string;
    entry_id_key?: string;
    entry_id?: number;
};

interface Types_change_order{
    table_name: string;
    sort_field?: string
    filter_key?: string
    filter_item?: string
    filter_key_2?: string
    filter_item_2?: string 
    order_key?: string 
    order_direction?:string 
}

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {};

// CONTEXT TO USE 
export const Use_Context_initial_data = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    change_order: ()=>{},
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_initial_data({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);
    const [context_data, set_context_data] = useState<Types_context_content>(initial_context_content);
    const context_ref = useRef<Types_context_content>(initial_context_content);


    async function fetch_info({table_name}:Types_context_function):Promise<Types_form_info>{

        try {
            const response = await axios.post("/get_columns",{
                table_name: table_name
            })
            // set input types
            const form_data: Types_form_data = {};
            const column_info: Types_column_info[] = response.data.map((item:Types_column_info, index:number) => {
              const item_name:string = item.column_name
  
                let initial_item_value: string | undefined = "";
                if(item_name.includes("date_added")){
                    item.input_type = "date";
                    const date = new Date().toISOString().slice(0,10);
                    initial_item_value = date;
                }else if(item_name.includes("date")){
                    item.input_type = "date";
                    initial_item_value = undefined;
                } else if (item_name.includes("admin")) {
                    item.input_type = "checkbox"
                    initial_item_value = "0";
                } else if (item_name.includes("color")) {
                    item.input_type = "color";
                    initial_item_value = "#F1F1F1"
                } else if (item_name.includes("order")){
                    item.input_type = "order";
                } else if (item_name.includes("pay_rate") || item_name.includes("budget")){
                    item.input_type = "text";
                    initial_item_value = "0.00";
                } else if (item_name.includes("employment_type")){
                    initial_item_value = "full_time";
                } else if (item_name.includes("part_time")){
                    initial_item_value = "0";
                } else if (item_name.includes("hours_per_week")){
                    initial_item_value = "40";
                } else if (item_name.includes("departments")){
                    initial_item_value = "";   
                } else if (item_name.includes("details")) {
                    item.input_type = "textarea"
                    initial_item_value = "";    
                } else {
                    item.input_type = "text"
                }; 
                
                form_data[item_name] = initial_item_value; 
                return(item);
            })
  
            return({
                db_column_info: column_info, 
                form_data: form_data
            })
        } catch (error) {
            console.log(`%cError getting db columns: ${error} `, 'darkred');
            return({
                db_column_info: [], 
                form_data: {}
            })
        }
    };

    async function fetch_data({table_name, entry_id, entry_id_key}:Types_context_function):Promise<Types_form_data[]>{
        
        !entry_id && (entry_id = 0);
        !entry_id_key && (entry_id_key = "");
        
        try {
            const response = await axios.post("/get_table_info",{
                table_name: table_name,
                filter_key: entry_id_key, 
                filter_item: entry_id,
            })
            return(response.data);
        } catch (error) {
            console.log(`%cError getting Table info: `, 'darkred', error);
            return([]) 
        }
    }

    


    // UPDATE THE CONTEXT 
    async function update_context({ table_name, entry_id, entry_id_key }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `${ log_colors.context }`, `for Context_initial_data`);

        const update_data:Types_context_content = {...context_ref.current, 
            [table_name]:{
                info: await fetch_info({table_name: table_name}),
                data: await fetch_data({table_name: table_name, entry_id:entry_id, entry_id_key:entry_id_key})
            }
        };

        

        const copy_data_array = Object.keys(update_data).map((key_name)=>{
            const entry_data = {...update_data}[key_name].data.map((entry_data)=>{
                return Object.freeze({...entry_data})
            });

            const entry_db_column_info = {...update_data}[key_name].info.db_column_info.map((entry_info)=>{
                return Object.freeze({...entry_info})
            });

            const entry_db_form_info = Object.freeze({...update_data[key_name].info.form_data})

            const entry_copy:Types_context_content = {[key_name]:{
                data:entry_data,
                info: {
                    db_column_info: entry_db_column_info,
                    form_data: entry_db_form_info
                }
            }}
            return entry_copy
        });

        const copy_data:Types_context_content = {};
        copy_data_array.forEach((entry)=>{
            const key_name = Object.keys(entry)[0];
            copy_data[key_name] = entry[key_name];
        })
        context_ref.current = copy_data;

        //console.log(`%c DATA `, `${ log_colors.data }`,`for copy_data_array`,'\n' ,copy_data_array);
        //console.log(`%c DATA `, `${ log_colors.data }`,`for copy_data`,'\n' ,copy_data);
        //console.log(`%c DATA `, `${ log_colors.data }`,`for update_data`,'\n' ,update_data);
        console.log(`   %c CONTEXT UPDATE DATA `, `${ log_colors.context }`, `for Context_initial_data`, context_ref.current);

        return copy_data;
    }

    async function change_order({ table_name, sort_field, filter_key, filter_item, filter_key_2, filter_item_2, order_key, order_direction,  }:Types_change_order){
        console.log(`%c CONTEXT ORDER CHANGE `, `${ log_colors.context }`, `for Context_initial_data`, '\n', send_context);

        try {
            const response = await axios.post("/get_table_info",{
                table_name: table_name,
                sort_field: sort_field,
                filter_key: filter_key,
                filter_item: filter_item, 
                filter_key_2: filter_key_2, 
                filter_item_2: filter_item_2,
                order_key: order_key,  
                order_direction: order_direction 
            })
            set_send_context((prev_vals)=>{
                const update_data = {...prev_vals,
                    [table_name]: {...prev_vals[table_name],
                        data: response.data
                    }    
                }
                console.log(`%c CONTEXT ORDER CHANGE RESULT `, `${ log_colors.context }`,`for Context_initial_data`,'\n' ,update_data);
                return update_data
            })
        } catch (error) {
            console.log(`%cError getting Table info: `, 'darkred', error);
        }
    }

// MEMOS AND EFFECTS

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_initial_data.Provider value={{
           update_func:{
               now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
               wait: update_context,
               update_context: (props:Types_context_content)=>{
                console.log(`%c UPDATE CONTEXT SHORTCUT `, `${ log_colors.important }`);
                set_send_context(props) 
               }
           },
           change_order: change_order,
           show_context:send_context}}
        >
            {children} 
        </Use_Context_initial_data.Provider> 
    );
}