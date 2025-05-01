import { useContext, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";
import Select_departments from "../../../_universal/table_data/Select_departments.js";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";
import { Use_Process_input_data } from "../../../_universal/Process_input_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_column_info } from "../../../context/Context_initial_data.js";
import { Types_form_data } from "../../../context/Context_initial_data.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";


interface Types_props{
    initial_data_object: Types_form_data;
}

interface Types_column_data{
   [key:string]: Types_column_info;
 }

 interface Types_update_input_change extends Types_input_change{
    update?:boolean;
 }

// THE COMPONENT 
export default function Employee_input_form({initial_data_object}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Employee_input`);

    const initial_data = useContext(Use_Context_initial_data).show_context["employees"];
    const process_data = useContext(Use_Process_input_data);

    const [input_data, set_input_data] = useState<Types_form_data>(initial_data_object);
    const employee_id: number | undefined = initial_data_object.id

    const column_data:Types_column_data = {};
    initial_data.info.db_column_info.forEach((column)=>{
            column_data[column.column_name] = column 
    })

    console.log(`%c DATA `, `${ log_colors.data }`,`for column_data`,'\n' ,column_data);

    function handle_input_change({input, db_column, update}:Types_update_input_change){
        if(update){
            set_input_data((prev_vals)=>{
                const update_data = {...prev_vals, [db_column]:input}
                return update_data;
            })
        }
        process_data.update_data({table_name:"employees", form_data:{input: input, db_column:db_column}})
    }

// MEMOS AND EFFECTS    

// RETURNED VALUES 
    return(
        <div id="cpe_input_box" className="cp_content_box">
            <form className="auto_form">
                <Form_auto_input 
                    column_info={column_data.name}
                    initial_data_object={initial_data_object}
                    send_table_data={handle_input_change}
                />
                <Form_auto_input 
                    column_info={column_data.email}
                    initial_data_object={initial_data_object}
                    send_table_data={handle_input_change}
                />
                <Form_auto_input 
                    column_info={column_data.admin}
                    initial_data_object={initial_data_object}
                    send_table_data={handle_input_change}
                />
                <Form_auto_input 
                    column_info={column_data.role}
                    initial_data_object={initial_data_object}
                    send_table_data={handle_input_change}
                />
                <Form_auto_input 
                    column_info={column_data.title}
                    initial_data_object={initial_data_object}
                    send_table_data={handle_input_change}
                />
                <Form_auto_input 
                    column_info={column_data.pay_rate}
                    initial_data_object={initial_data_object}
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
                        <Form_auto_input 
                        column_info={column_data.hours_per_week}
                        initial_data_object={initial_data_object}
                        send_table_data={handle_input_change}
                        />
                    }

                <div id="employment_date_box">
                    <Form_auto_input 
                        column_info={column_data.employment_start_date}
                        initial_data_object={initial_data_object}
                        send_table_data={handle_input_change}
                    />
                        
                    {input_data.employment_type === "contract" &&
                        <Form_auto_input 
                            column_info={column_data.employment_end_date}
                            initial_data_object={initial_data_object}
                            send_table_data={handle_input_change}
                        />
                    }

                </div>
            </form>
            <Select_departments 
                employee_id = {employee_id}
            />
        </div>
    ); 
}
