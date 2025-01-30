import axios from "axios";
import { useState, useEffect, useContext } from "react";

// CONTEXT IMPORTS
import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../context/Context_db_table_info.js";

export interface Types_get_table_data {
    section_name: string;
    sort_field?: string;
    filter_key?: string;
    filter_item?: string | number;
    order_key?: string;
}


export default function useGetTableData({ section_name,  sort_field, filter_key, filter_item, order_key }:Types_get_table_data) {

    const [form_data, set_form_data] = useState<Types_form_data[]>([]);

    
    // FIND THE KEY NAME FOR THE ORDER
    const db_column_names = useContext(Use_Context_Table_Info).show_context.db_column_info.map((item)=>item.column_name);

    const order_id_key:string | void = db_column_names.find((key_name)=>{
        if(order_key && key_name.includes(order_key)){
            return key_name;
        } 
    });

    // GET EXISTING FORM INFORMATION FROM THE DATABASE AND ADD IT TO THE FORM
    async function get_form_info(){
        console.log(`%cSection Name changed to ${section_name}, useGetTableData data changed`, 'background-color:cornflowerblue');
        try {
            const response = await axios.post("/get_table_info",{
                table_name: section_name,
                sort_field: sort_field,
                filter_key: filter_key,
                filter_item: filter_item,
                order_key: order_id_key ? order_id_key :"id" 
            })
            const data = response.data;
            console.log(`%cThe current data: `, 'background-color:', data);
            set_form_data(data);
            
        } catch (error) {
            console.log(`%cError getting Table info: `, 'background-color:darkred', error); 
        }
    };

    useEffect(() =>{
        if(section_name !== ""){
            get_form_info()
        }
    },[section_name])

  return form_data;
}


