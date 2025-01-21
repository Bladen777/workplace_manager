import axios from "axios";
import { useState, useEffect, useRef } from "react";


// TYPE DEFINITIONS
import { Types_form_data } from "./useDBTableColumns.js";

export interface Types_get_table_data {
    section_name: string,


    sort_field?: string,
    filter_name?: string,
    filter_item?: string | number,
    order_item?: string
}


export default function useGetTableData({ section_name,  sort_field, filter_name, filter_item, order_item }:Types_get_table_data) {

    const [form_data, set_form_data] = useState<Types_form_data[]>([]);

    // GET EXISTING FORM INFORMATION FROM THE DATABASE AND ADD IT TO THE FORM
    async function get_form_info(){
        console.log(`%cSection Name changed to ${section_name}, useGetTableData data changed`, 'background-color:cornflowerblue');

        try {
            const response = await axios.post("/get_table_info",{
                table_name: section_name,

                sort_field: sort_field,
                filter_name: filter_name,
                filter_item: filter_item,
                order_item: order_item
            })
            const data = response.data;
            console.log(`%cThe current data: `, 'background-color:', data);

            set_form_data(data);
            
        } catch (error) {
            console.log(`%cError getting Table info: `, 'background-color:darkred', error); 
        }
    };

    useEffect(() =>{
      get_form_info()
    },[section_name])

  return form_data;
}


