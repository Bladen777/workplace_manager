import { useContext, useRef, useState, useEffect } from "react";

// COMPONENT IMPORTS

// CONTEXT IMPORTS
import { Use_Context_table_info } from "../../context/Context_db_table_info.js";
import { Use_Context_table_data } from "../../context/Context_get_table_data.js";

// HOOK IMPORTS
import useFindClickPosition from "../../../hooks/useFindClickPosition.js";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
interface Types_active_sort_btn{
    order_key?:string;
    direction?:string;
}


// THE COMPONENT
export default function Control_panel_sort_button() {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`,`for control_panel_sort_btn`);
    
    const [clicked, set_clicked] = useState<boolean>(false);
    const options_menu_ref = useRef<HTMLDivElement | null>(null);
    const track_click = useFindClickPosition();

    const active_sort_btn = useRef<Types_active_sort_btn>({
        order_key: "id",
        direction: "asc"
    });

    const update_table_data = useContext(Use_Context_table_data).update_func;
    const db_column_names = useContext(Use_Context_table_info).show_context.db_column_info.map((item)=>item.column_name);
    
    function handle_sort_btn_clicked({order_key, direction}:Types_active_sort_btn){
        order_key && (active_sort_btn.current.order_key = order_key);
        direction && (active_sort_btn.current.direction = direction);
        update_table_data.now({order_key: active_sort_btn.current.order_key, order_direction: active_sort_btn.current.direction})

    }
    function convert_text(word:string){
        let text = word.replaceAll("_"," ")
        const first_letter = text.slice(0,1).toUpperCase();
        text = first_letter + text.slice(1);
        return text;
    }

    function sort_options(item:string, index:number){
        return(
            <button
            className={`cpv_sort_option_btn ${active_sort_btn.current.order_key === item && "active_sort_btn"}`}
            key={index}
            onClick={()=>{handle_sort_btn_clicked({order_key:item})}}>
            {convert_text(item)}
            </button>
        )
    }

// MEMOS AND EFFECTS    
    useEffect(() =>{
        clicked && track_click({
            ele_name:"Sort options Button" ,
            active: true, 
            ele_pos:options_menu_ref.current?.getBoundingClientRect(), 
            update_func:(value:boolean)=>{value && set_clicked(false)}
        })
    },[clicked])

// RETRURNED VALUES
    return (
        <div id="cpv_sort_btn" >
        {clicked &&
            <div id="cpv_sort_options" ref={options_menu_ref}>
                <div id="cpv_sort_type">
                    <button
                        className={`cpv_sort_type_btn cpv_sort_option_btn ${active_sort_btn.current.direction ==="asc" && "active_sort_btn"}`}
                        onClick={()=>{handle_sort_btn_clicked({direction:"asc"})}}
                    >Asc</button>
                    <button
                        className={`cpv_sort_type_btn cpv_sort_option_btn ${active_sort_btn.current.direction ==="desc" && "active_sort_btn"}`}
                        onClick={()=>{handle_sort_btn_clicked({direction:"desc"})}}
                    >Desc</button>
                </div>
                {db_column_names.map(sort_options)}
            </div>
        }

        {!clicked && 
            <button  className="cp_utility_bar_btn general_btn"
                onClick={()=>set_clicked(!clicked)}
        > 
        Sort 
        </button>
        }
        </div>
      
 
  )
}
