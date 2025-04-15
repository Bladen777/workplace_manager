import axios from "axios";
import { createContext, useState, ReactNode,} from "react"

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
interface Types_context {
    update_func:{
        now:Function;
        wait:Function;
        update_context: Function;
    };
    show_context:Types_context_content; 
};

interface Types_context_content extends Types_initial_data {};

interface Types_context_function {
  section_name:string;
};

export interface Types_column_info{
  column_name: string;
  is_nullable: string;
  input_type: string;
};

export interface Types_form_data{
   id?:number;
  [key:string]: string | number | undefined;
}

export interface Types_initial_data{
  table_name: string;  
  db_column_info:Types_column_info[];
  initial_form_data:Types_form_data;
}


// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {
    table_name:"",
    db_column_info:[{column_name: "", is_nullable: "", input_type: "" }], 
    initial_form_data:{[""]:""}
};

// CONTEXT TO USE 
export const Use_Context_table_info = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_table_info({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    // UPDATE THE CONTEXT 
    async function update_context({section_name }:Types_context_function){
  
      console.log(`%c CONTEXT UPDATE `, `background-color:${log_colors.context}`, `db_table_info for ${section_name}`);
      try {
          const response = await axios.post("/get_columns",{
              table_name: section_name
          })
          // set input types
          const form_data: Types_form_data = {};
          const column_info: Types_column_info[] = response.data.map((item:Types_column_info, index:number) => {
            const item_name:string = item.column_name

            let initial_item_value: string | undefined = "";
            if(item_name.includes("date")){
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
            } else if (item_name.includes("pay_rate")){
                item.input_type = "text";
                initial_item_value = "0.00";
            } else if (item_name.includes("employment_type")){
                initial_item_value = "full_time";
            } else if (item_name.includes("part_time")){
                initial_item_value = "0";
            } else if (item_name.includes("hours_per_week")){
                initial_item_value = "40";


                // FIX THIS, NEED FOR ARRAYS
            } else if (item_name.includes("departments")){
                initial_item_value = "";   
                
                
            } else {
                item.input_type = "text"
            }; 
            
            
            form_data[item_name] = initial_item_value; 
            return(item);
          })

        return({
            table_name: section_name, 
            db_column_info: column_info, 
            initial_form_data:form_data
        }) 
      } catch (error) {
          console.log(`%cError getting db columns: ${error} `, 'background-color:darkred');
          return(initial_context_content)   
      }
    }
    

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_table_info.Provider value={{
            update_func:{
                now:async (props:Types_context_function)=>{set_send_context(await update_context(props))},
                wait:update_context,
                update_context:set_send_context 
            },
            show_context:send_context}}
        >
            {children} 
        </Use_Context_table_info.Provider> 
    );
}
