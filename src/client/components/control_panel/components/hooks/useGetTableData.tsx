import axios from "axios";
import { useState, useEffect, useContext } from "react";

// CONTEXT IMPORTS
import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";

// LOG STYLE IMPORTS
import { log_colors } from "../../../../styles/log_colors.js";

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
    const db_column_names = useContext(Use_Context_Table_Info).show_context.db_column_info.map((item)=>item.column_name);

    function find_order_id_key(){
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
    async function get_form_info(){
        const order_id_key:string = find_order_id_key();
        console.log(`%c HOOK `, `background-color:${log_colors.hook}`, `useGetTableData order_id_key: `, order_id_key);
        try {
            const response = await axios.post("/get_table_info",{
                table_name: section_name,
                sort_field: sort_field,
                filter_key: filter_key,
                filter_item: filter_item,
                order_key: order_id_key
            })
            const data = response.data;
            console.log(`   %c DATA `, `background-color:${ log_colors.data }`,`for ${section_name} `, '\n' , data);
            set_form_data(data);
            
        } catch (error) {
            console.log(`%cError getting Table info: `, 'background-color:darkred', error); 
        }
    };

    useEffect(() =>{
        if(section_name !== ""){
            get_form_info()
        }
    },[section_name, order_key])

    return form_data;
    
}


