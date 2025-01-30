import { createContext, ReactNode, useState } from "react"
import axios from "axios";

// TYPE DEFINITIONS
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
  db_column_info:Types_column_info[];
  initial_form_data:Types_form_data;
}

interface Types_context{
    update_func:Function;
    show_context:Types_initial_data;
}

const initial_values = {
    db_column_info:[{column_name: "", is_nullable: "", input_type: "" }], 
    initial_form_data:{[""]:""}
}

// The Value to use
export const Use_Context_Table_Info = createContext<Types_context>({update_func:()=>{}, show_context: initial_values});

// The Component returned 
export function Provide_Context_Table_Info({children}:{children:ReactNode}) {

    const [table_info, set_table_info] = useState<Types_initial_data>(initial_values)

      // INITIAL FUNCTION TO GATHER THE DATA FROM DATABASE REQUIRED TO CREATE FORMS
    async function change_table_info(section_name:string) {
      console.log(`%cSection Name changed to ${section_name}, useDBTableColumns data changed`, 'background-color:cornflowerblue');
      try {
          const response = await axios.post("/get_columns",{
              table_name: section_name
          })
          // set input types
          const form_data: Types_form_data = {};
          const column_info: Types_column_info[] = response.data.map((item:Types_column_info, index:number) => {
              const item_name:string = item.column_name
              let input_type;
              let initial_item_value = "";
                  if(item_name.includes("date")){
                      input_type = "date"
                  } else if (item_name.includes("admin")) {
                      input_type = "checkbox"
                  } else if (item_name.includes("color")) {
                      input_type = "color";
                      initial_item_value = "#F1F1F1"
                  } else if (item_name.includes("order")){
                      input_type = "order";
                  } else {
                      input_type = "text"
                  }; 
                  item.input_type = input_type;
                  form_data[item_name] = initial_item_value; 
                  return(item);
          })
          set_table_info({db_column_info: column_info, initial_form_data:form_data}) 
      } catch (error) {
          console.log(`%cError getting db columns: ${error} `, 'background-color:darkred');   
      }
    }

  return (
    <Use_Context_Table_Info.Provider value={{update_func:change_table_info, show_context:table_info}}>
        {children}
    </Use_Context_Table_Info.Provider>
  )
}