import axios from "axios";
import { section } from "framer-motion/client";
import { useEffect, useRef, useState } from "react";

// TYPE DEFINITIONS 
export interface Types_column_info{
    column_name: string;
    is_nullable: string;
    input_type: string;
};

export interface Types_form_data{
    [key:string]: string;
}

export interface Types_initial_data{
    db_column_info:Types_column_info[],
    initial_form_data:Types_form_data
}


// THE COMPONENT
export default function useDBTableColumns(section_name:string) {
   

    const [db_column_info, set_db_column_info] = useState<Types_column_info[]>([]);
    const [form_data, set_form_data] = useState<Types_form_data>({});
    

    // INITIAL FUNCTION TO GATHER THE DATA FROM DATABASE REQUIRED TO CREATE FORMS
    async function get_db_columns() {
        console.log(`%cSection Name changed to ${section_name}, useDBTableColumns data changed`, 'background-color:cornflowerblue');
        try {
            const response = await axios.post("/get_columns",{
                table_name: section_name
            })

            // set input types
            const column_info = response.data.map((item:Types_column_info, index:number) => {
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
                        input_type = "range";
                    } else {
                        input_type = "text"
                    }; 
                    item.input_type = input_type;
                    form_data[item_name] = initial_item_value; 
                    return(item);
            })
            set_db_column_info(column_info);
            
        } catch (error) {
            console.log(`%cError getting db columns: ${error} `, 'background-color:darkred');   
        }
    }

    useEffect(()=>{
        get_db_columns();
    },[section_name])


    return({
        db_column_info: db_column_info,
        initial_form_data:form_data
    })
}