import axios from "axios";
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


// THE COMPONENT
export default function useDBTableColumns(section_name:string) {
    console.log(`%cuseDBTableColumns Called for ${section_name}`, 'background-color:darkorchid',);

    const [db_column_info, set_db_column_info] = useState<Types_column_info[]>([]);
    const [form_data, set_form_data] = useState<Types_form_data>({});
    
    // INITIAL FUNCTION TO GATHER THE DATA FROM DATABASE REQUIRED TO CREATE FORMS
    async function get_db_columns() {
        try {
            const response = await axios.post("/get_columns",{
                table_name: section_name
            })

            // set input types
            const column_info = response.data.map((item:Types_column_info, index:number) => {
                const item_name = item.column_name
                let input_type;
                    if(item_name.includes("date")){
                        input_type = "date"
                    } else if (item_name.includes("admin")) {
                        input_type = "checkbox"
                    } else if (item_name.includes("color")) {
                        input_type = "color"
                    } else if (item_name.includes("order")){
                        input_type = "range";
                    } else {
                        input_type = "text"
                    }; 
                    item.input_type = input_type;
                    return(item);
            })
            
            // set initial form_data
            response.data.map((item:Types_column_info, index:number) => {
                const item_name:string = item.column_name;
                form_data[item_name] = "";  

            set_db_column_info(column_info);
            });
        } catch (error) {
            console.log('%cError getting db columns: ', 'background-color:darkred',error);   
        }
        console.log("Getting the db_column_info finished")
    }

    useEffect(()=>{
        get_db_columns();
    },[])


    return({
        db_column_info: db_column_info,
        initial_form_data:form_data
    })
}