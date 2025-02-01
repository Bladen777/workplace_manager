import { useContext, useState } from "react";

// CONTEXT IMPORTS
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/log_colors.js";

// THE COMPONENT
export default function Control_panel_sort_button({change_sort}:{change_sort:Function}) {
    const [clicked, set_clicked] = useState<boolean>(false)

    const db_column_names = useContext(Use_Context_Table_Info).show_context.db_column_info.map((item)=>item.column_name);


    function sort_options(item:string, index:number){
        return(
            <button
            className="control_panel_btn"
            key={index}
            onClick={()=>{
                change_sort(item)
                set_clicked(false)
            }}
            >
            {item}
            </button>

        )
    }


    

    return (
        <div id="cpv_sort_btn" >
        {clicked &&
            <div id="cpv_sort_options">
                {db_column_names.map(sort_options)}
            </div>
        }

        {!clicked && 
            <button  className="control_panel_btn"
                onClick={()=>set_clicked(!clicked)}
        > 
        Sort 
        </button>
        }
        </div>
      
 
  )
}
