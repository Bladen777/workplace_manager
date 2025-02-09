import { useContext, useRef, useState, useEffect } from "react";

// HOOK IMPORTS
import useFindClickPosition from "../../hooks/useFindClickPosition.js";

// CONTEXT IMPORTS
import { Use_Context_Table_Info } from "../context/Context_db_table_info.js";

// LOG STYLE IMPORTS
import { log_colors } from "../../../styles/_log_colors.js";


// THE COMPONENT
export default function Control_panel_sort_button({change_sort}:{change_sort:Function}) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`,`for control_panel_sort_btn`);
    
    const [clicked, set_clicked] = useState<boolean>(false)

    const db_column_names = useContext(Use_Context_Table_Info).show_context.db_column_info.map((item)=>item.column_name);
    const options_menu_ref = useRef<HTMLDivElement | null>(null);

    const track_click = useFindClickPosition();

    function sort_options(item:string, index:number){
        return(
            <button
            className="control_panel_btn"
            key={index}
            onClick={()=>{
                change_sort(item)
                set_clicked(false)
                track_click({active:false})
            }}
            >
            {item}
            </button>
        )
    }
    
    useEffect(() =>{
        clicked && track_click({
            active: true, 
            ele_pos:options_menu_ref.current?.getBoundingClientRect(), 
            update_func:(value:boolean)=>{value && set_clicked(false)}
        })
    },[clicked])


    return (
        <div id="cpv_sort_btn" >
        {clicked &&
            <div id="cpv_sort_options" ref={options_menu_ref}>
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
