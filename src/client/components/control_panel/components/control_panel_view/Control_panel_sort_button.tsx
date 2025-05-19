import { useContext, useRef, useState, useEffect } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";

// HOOK IMPORTS
import useFindClickPosition from "../../../hooks/useFindClickPosition.js";

// COMPONENT IMPORTS

// TYPE DEFINITIONS
interface Types_active_sort_btn{
    order_key?:string;
    direction?:string;
}

interface Types_props{
    active_table:string;
}

// THE COMPONENT
export default function Control_panel_sort_button({active_table}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`,`for control_panel_sort_btn`);

    const initial_data = useContext(Use_Context_initial_data).show_context[active_table];
    const change_initial_data_order = useContext(Use_Context_initial_data).change_order;
    
    const [clicked, set_clicked] = useState<boolean>(false);
    const options_menu_ref = useRef<HTMLDivElement | null>(null);
    const track_click = useFindClickPosition();

    const active_sort_btn = useRef<Types_active_sort_btn>({
        order_key: "id",
        direction: "asc"
    });

    const db_column_names = initial_data.info.db_column_info.map((item)=>item.column_name);
    
    function handle_sort_btn_clicked({order_key, direction}:Types_active_sort_btn){
        order_key && (active_sort_btn.current.order_key = order_key);
        direction && (active_sort_btn.current.direction = direction);
        change_initial_data_order({order_key: active_sort_btn.current.order_key, order_direction: active_sort_btn.current.direction})

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
