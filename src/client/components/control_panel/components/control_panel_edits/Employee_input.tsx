import { useContext, useState } from "react";

// COMPONENT IMPORTS 
import Control_panel_input from "./Control_panel_input.js";

// CONTEXT IMPORTS 
import { Use_Context_Table_Data } from "../../context/Context_get_table_data.js";
import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";
import { Use_Context_current_table_item } from "../../context/Context_current_table_item.js";

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_column_info } from "../../context/Context_db_table_info.js";
import { Types_form_data } from "../../context/Context_db_table_info.js";
import { Types_input_change } from "./Control_panel_input.js";

interface Types_input_form{
    send_table_data: Function;
}


interface Types_column_data{
   [key:string]: Types_column_info;
 }



// THE COMPONENT 
export default function Employee_input({send_table_data}:Types_input_form) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Employee_input`);
    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;

    const current_table_data = useContext(Use_Context_current_table_item).show_context;
    const [input_data, set_input_data] = useState<Types_form_data>(current_table_data);

    const column_data:Types_column_data = {};
    db_column_info.forEach((column)=>{
            column_data[column.column_name] = column 
    })

    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for db_column_info`,'\n' ,db_column_info);
    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for column_data`,'\n' ,column_data);


    function handle_input_change({input, db_column}:Types_input_change){
        set_input_data({...input_data, [db_column]:input})
        send_table_data({...input_data, [db_column]:input})
    }

    // RETURNED VALUES 
    return(
        <form className="cpe_form">
            <Control_panel_input 
                column_info={column_data.name}
                send_table_data={send_table_data}
            />
            <Control_panel_input 
                column_info={column_data.email}
                send_table_data={send_table_data}
            />
            <Control_panel_input 
                column_info={column_data.admin}
                send_table_data={send_table_data}
            />
            <Control_panel_input 
                column_info={column_data.role}
                send_table_data={send_table_data}
            />
            <Control_panel_input 
                column_info={column_data.title}
                send_table_data={send_table_data}
            />
            <Control_panel_input 
                column_info={column_data.pay_rate}
                send_table_data={send_table_data}
            />

            <div id="employment_type_box">
                    <input
                        id="full_time"
                        name="employ_type"
                        value="full_time"
                        type="radio"
                        onChange={(e)=>handle_input_change({input: e.target.value, db_column:"employment_type"})}
                    />
                    <label htmlFor="full_time">Full Time</label>

                    <input
                        id="contract"
                        name="employ_type"
                        value="contract"
                        type="radio"
                        onChange={(e)=>handle_input_change({input: e.target.value, db_column:"employment_type"})}
                    />
                    <label htmlFor="contract">Contract</label>

                    <input
                        id="part_time"
                        name="part_time_check"
                        value={input_data.part_time}
                        type="checkbox"
                        onChange={(e)=>{
                            let value = e.target.value;
                            if(e.target.checked){
                                value="1"
                            } else {
                                value="0"
                            }
                            handle_input_change({input: value, db_column:"part_time"})
                        }}
                    />
                    <label htmlFor="part_time">Part Time</label>

            </div>

            <div id="employment_date_box">
                <Control_panel_input 
                    column_info={column_data.employment_start_date}
                    send_table_data={send_table_data}
                />
                    
                {input_data.employment_type === "contract" &&
                    <Control_panel_input 
                        column_info={column_data.employment_end_date}
                        send_table_data={send_table_data}
                    />
                }

                {input_data.part_time === "1" &&
                    <Control_panel_input 
                    column_info={column_data.hours_per_week}
                    send_table_data={send_table_data}
                    />
                }
            </div>

        </form>
    ); 
}
