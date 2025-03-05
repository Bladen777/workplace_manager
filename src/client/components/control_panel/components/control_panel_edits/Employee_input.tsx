import { useContext, useState } from "react";

// COMPONENT IMPORTS 
import Control_panel_input from "../../../_universal/inputs/Form_auto_input.js";

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
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";


interface Types_props{
    send_table_data: Function;
}

interface Types_column_data{
   [key:string]: Types_column_info;
 }

 interface Types_update_input_change extends Types_input_change{
    update?:boolean;
 }

// THE COMPONENT 
export default function Employee_input({send_table_data}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Employee_input`);
    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;

    const current_table_data = useContext(Use_Context_current_table_item).show_context.current_table_item;
    const [input_data, set_input_data] = useState<Types_form_data>(current_table_data);

    const column_data:Types_column_data = {};
    db_column_info.forEach((column)=>{
            column_data[column.column_name] = column 
    })

    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for db_column_info`,'\n' ,db_column_info);
    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for column_data`,'\n' ,column_data);


    function handle_input_change({input, db_column, update}:Types_update_input_change){
        if(update){
            set_input_data({...input_data, [db_column]:input})
        }
        send_table_data({input: input, db_column:db_column})
    }

    // RETURNED VALUES 
    return(
        <form className="cpe_form">
            <Control_panel_input 
                column_info={column_data.name}
                send_table_data={handle_input_change}
            />
            <Control_panel_input 
                column_info={column_data.email}
                send_table_data={handle_input_change}
            />
            <Control_panel_input 
                column_info={column_data.admin}
                send_table_data={handle_input_change}
            />
            <Control_panel_input 
                column_info={column_data.role}
                send_table_data={handle_input_change}
            />
            <Control_panel_input 
                column_info={column_data.title}
                send_table_data={handle_input_change}
            />
            <Control_panel_input 
                column_info={column_data.pay_rate}
                send_table_data={handle_input_change}
            />

            <div id="employment_type_box">

                <label className="cpe_input_label radio_label">
                    <input
                        id="full_time"
                        className="cpe_radio"
                        name="employ_type"
                        value="full_time"
                        type="radio"
                        checked = {input_data.employment_type === "full_time" ? true : false}
                        onChange={(e)=>handle_input_change({input: e.target.value, db_column:"employment_type", update:true})}
                    />
                    {" "}Full Time</label>

                    <label className="cpe_input_label radio_label">
                    <input
                        id="contract"
                        className="cpe_radio"
                        name="employ_type"
                        value="contract"
                        type="radio"
                        checked = {input_data.employment_type === "contract" ? true : false}
                        onChange={(e)=>handle_input_change({input: e.target.value, db_column:"employment_type", update:true})}
                    />
                    {" "}Contract</label>
                    
                    <label className="cpe_input_label checkbox_label">
                    <input
                        id="part_time"
                        className="cpe_checkbox"
                        name="part_time_check"
                        value={input_data.part_time}
                        type="checkbox"
                        checked = {input_data.part_time === "1" ? true : false}
                        onChange={(e)=>{
                            let value = e.target.value;
                            if(e.target.checked){
                                value="1"
                            } else {
                                value="0"
                            }
                            handle_input_change({input: value, db_column:"part_time", update:true})
                        }}
                    />
                    {" "}Part Time</label>

            </div>

            {input_data.part_time === "1" &&
                    <Control_panel_input 
                    column_info={column_data.hours_per_week}
                    send_table_data={handle_input_change}
                    />
                }

            <div id="employment_date_box">
                <Control_panel_input 
                    column_info={column_data.employment_start_date}
                    send_table_data={handle_input_change}
                />
                    
                {input_data.employment_type === "contract" &&
                    <Control_panel_input 
                        column_info={column_data.employment_end_date}
                        send_table_data={handle_input_change}
                    />
                }

                
            </div>

        </form>
    ); 
}
