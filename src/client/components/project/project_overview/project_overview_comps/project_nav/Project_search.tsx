import { useCallback, useEffect, useRef } from "react";

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 
import Form_auto_input from "../../../../_universal/inputs/Form_auto_input.js";

// TYPE DEFINITIONS
interface Types_props{
    close_dd: Function;
}

// THE COMPONENT 
export default function Project_search({close_dd}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_search`);
    const initial_render = useRef<boolean>(true);


    const callback_handle_date_change = useCallback(()=>{},[])    

// MEMOS AND EFFECTS
    useEffect(() =>{
        initial_render.current = false;
    },[]);

// RETURNED VALUES 
    return(
        <>
        {/* 
        <Form_auto_input
            column_info = {{
                column_name: "from_date",
                is_nullable: "YES",
                input_type: "date"
            }}
            label_name="From Date"
            initial_data_object={{from_date:""}}
            send_table_data = {callback_handle_date_change}
        />
        <Form_auto_input
            column_info = {{
                column_name: "to_date",
                is_nullable: "YES",
                input_type: "date"
            }}
            label_name="To Date"
            initial_data_object={{from_date:""}}
            send_table_data = {callback_handle_date_change}
        />

        <button
            className="general_btn"
        >
            <h4>Filter Projects</h4>
        </button>
        
        */}
        
        <button
            className="general_btn"
            onClick={()=>{close_dd()}}
        >
            <h4>Cancel</h4>
        </button>
        <h2>UNDER WORK</h2>

        </>
    ); 
}