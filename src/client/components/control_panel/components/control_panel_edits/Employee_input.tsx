import { useContext, useState } from "react";

// COMPONENT IMPORTS 


// CONTEXT IMPORTS 

import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";
// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_input_form } from "../Control_panel_edit.js";

import { Types_form_data } from "../../context/Context_db_table_info.js";
import { form } from "framer-motion/client";
import { Use_Context_Table_Data } from "../../context/Context_get_table_data.js";

// THE COMPONENT 
export default function Employee_input({send_table_data, submit_method}:Types_input_form) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Employee_input`);
    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    const initial_table_data = useContext(Use_Context_Table_Data).show_context;

    const form_data = {
        name: db_column_info.find((item)=>item.column_name.includes("name")),
        pay_rate: db_column_info.find((item)=>item.column_name.includes("pay_rate")),
        pay_type: db_column_info.find((item)=>item.column_name.includes("pay_type")),
        admin: db_column_info.find((item)=>item.column_name.includes("admin")),
        hours_p_w: db_column_info.find((item)=>item.column_name.includes("hours")),
        start_date: db_column_info.find((item)=>item.column_name.includes("start")),
        end_date: db_column_info.find((item)=>item.column_name.includes("end")),
        status: db_column_info.find((item)=>item.column_name.includes("status")),
        
        role: db_column_info.find((item)=>item.column_name.includes("role")),
        title: db_column_info.find((item)=>item.column_name.includes("title")),
        email: db_column_info.find((item)=>item.column_name.includes("email"))
    }

    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for db_column_info`,'\n' ,db_column_info);
    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data);


    // RETURNED VALUES 
    return(
        <form className="cpe_form">
         0


        </form>
    ); 
}
