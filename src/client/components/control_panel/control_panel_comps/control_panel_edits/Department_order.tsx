import axios from "axios";
import { useEffect, useRef } from "react";


// CUSTOM HOOKS
import useDBTableColumns from "../hooks/useDBTableColumns.js";

// TYPE DEFINITIONS
import { Types_column_info } from "../hooks/useDBTableColumns.js";

export default function Department_order() {

    const get_initial_info = useDBTableColumns("departments");
    
        const db_column_info_ref = useRef<Types_column_info[]>([]);
        db_column_info_ref.current = get_initial_info.db_column_info;
        const db_column_info = db_column_info_ref.current;


    // GET THE EXISTING INFOMATION 
    async function get_table_range(item_name:string){
        try {
            const response = await axios.post("/get_table_info", {
                table_name: "departments",
                }
            )
            const data:number = response.data.length + 1;
            console.log("the table range: ", data)
            return data
        } catch (error) {
            console.log('%cError getting table range: ', 'background-color:darkred',error);
        }  
    }

    useEffect(() =>{
      get_table_range
    },[])

  return (
    <div>Department_order</div>
  )
}
