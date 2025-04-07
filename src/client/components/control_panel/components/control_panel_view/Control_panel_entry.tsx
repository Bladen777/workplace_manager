import { useContext, useState, memo, ReactElement, useEffect, useMemo, useRef } from "react";

// COMPONENT IMPORTS 
import Control_panel_entry_data from "./Control_panel_entry_data.js";
import Employee_deps from "./Employee_deps.js";

// CONTEXT IMPORTS 
import { Use_Context_table_info } from "../../context/Context_db_table_info.js";

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 

import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../context/Context_db_table_info.js";


interface Types_props{
    is_active:boolean;
    item_data: Types_form_data;
    item_index: number;
    send_selected_ele: Function;
}


// THE COMPONENT 
function Control_panel_entry({is_active, item_data, item_index, send_selected_ele}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Control_panel_entry for ${item_data.name}`);
    const section_name = useContext(Use_Context_table_info).show_context.table_name;

    useEffect(() =>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for is_active`,'\n' ,is_active);
    },[is_active])

    useEffect(() =>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for item_data`,'\n' ,item_data);
    },[item_data])

    useEffect(() =>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for item_index`,'\n' ,item_index);
    },[item_index])

    useEffect(() =>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for send_selected_ele`,'\n' ,send_selected_ele);
    },[send_selected_ele])


    // RETURNED VALUES 
    return(            
        <figure
            onClick={()=>{
                console.log(`%c CONTROL PANEL ENTRY CLICKED `, `background-color:${ log_colors.data }`,`for item_data`,'\n' ,item_data);
                send_selected_ele({item:item_data, index:item_index});
            }}
            className={
                item_index % 2 === 0 ? 
                `cpv_entry ${is_active && "selected_cpv_entry"}` 
                : 
                `cpv_entry cpv_entry_odd ${is_active && "selected_cpv_entry"}`   
            } 
        >
            <div className="control_panel_entry">
                <Control_panel_entry_data     
                    table_item = {item_data}
                />
                {section_name === "employees" &&
                    <Employee_deps
                        employee_id = {item_data.id!}
                    />
                }   
            </div>
        </figure>
    ); 
}

export default memo(Control_panel_entry);

