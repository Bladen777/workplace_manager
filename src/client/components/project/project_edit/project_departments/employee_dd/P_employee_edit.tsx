import { useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 
import { Use_Process_input_data } from "../../../../_universal/Process_input_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js";


// TYPE DEFINITIONS
import { Types_data_change } from "../../../../_universal/Process_input_data.js";
import { Types_input_change } from "../../../../_universal/inputs/Form_auto_input.js";
import { Types_form_data } from "../../../../control_panel/context/Context_db_table_info.js";
import { Types_search_item } from "../../../../_universal/drop_downs/Input_drop_down.js";


interface Types_props{
    department_budget:Function
    data:Types_search_item;
    rate:number;
    remove_employee: Function;
}

interface Types_employee_data{
    budget:number;
    hours:number;
}

// THE COMPONENT 
export default function P_employee_edit({department_budget, data, rate, remove_employee}:Types_props) {
    console.log(`%c INPUT_COMPONENT `, `background-color:${ log_colors.input_component }`, `P_employee_edit`);

    const process_data = useContext(Use_Process_input_data);

    const [employee_budget, set_employee_budget] = useState<number>(0)
    const [employee_hours, set_employee_hours] = useState<number>(0)

    const employee_data_ref = useRef<Types_employee_data>({
        budget:0,
        hours:0
    })

    const e_select_box_ele = useRef<HTMLDivElement | null>(null);

    function handle_input_change({input, db_column}:Types_input_change){
        
        let update_budget:number = employee_data_ref.current!.budget;
        let update_hours:number = employee_data_ref.current!.hours;

        if(db_column === "hours"){
            update_hours = Number(input);
            update_budget = update_hours * rate;
        } else {
            update_budget = Number(input);
            update_hours = Number((update_budget/rate).toFixed(2));
        }

        employee_data_ref.current = {
            budget: update_budget,
            hours: update_hours
        }

        set_employee_budget(update_budget);
        set_employee_hours(update_hours);

/*
        const budget_form_data: Types_input_change = {
            input: String(update_budget),
            db_column: "budget"
        }
        const hour_form_data: Types_input_change = {
            input: String(update_hours),
            db_column: "budget_hours"
        }

        process_data.handle_form_change({section_name:"projects" , table_name: "employee_budgets", form_data: budget_form_data})
        process_data.handle_form_change({section_name:"projects" , table_name: "employee_budgets", form_data: hour_form_data})

*/
    }

    function handle_remove_employee(){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for remove employee`);
        e_select_box_ele.current!.style.animation = `toggle_e_select_box 1s ease reverse forwards`;
        e_select_box_ele.current!.addEventListener("animationend", animation_ended);

        function animation_ended(){
            e_select_box_ele.current!.removeEventListener("animationend", animation_ended);
            remove_employee()
        }
    }



// MEMOS AND EFFECTS

useEffect(() =>{
    e_select_box_ele.current!.style.animation = `toggle_e_select_box 1s ease normal forwards`;
    e_select_box_ele.current!.addEventListener("animationend", animation_done);

    function animation_done(){
        e_select_box_ele.current!.removeEventListener("animationend", animation_done);
        e_select_box_ele.current!.style.animation ="";
    }
},[])

/*

useEffect(() =>{
  console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for data`,'\n' ,data);
},[data])

useEffect(() =>{
    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for rate`,'\n' ,rate);
  },[rate])

  useEffect(() =>{
    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for remove_employee`,'\n' ,remove_employee);
  },[remove_employee])  
*/

useEffect(() =>{
    console.log(`%c DATA `, `background-color:${ log_colors.important }`,`for department_budget`,'\n' ,department_budget());
},[department_budget()])

console.log(`%c DATA `, `background-color:${ log_colors.important }`,`for department_budget`,'\n' ,department_budget());
// RETURNED VALUES 
    return(
        <div 
            ref = {e_select_box_ele}
            className={
                employee_budget > department_budget()
                ? "over_budget e_select_box"
                : "e_select_box" 
            }
        >
            {/* LABEL FOR NAME */}
            <h3>{data.name}</h3>

            <div
                className="e_select_input_box"
            >
                {/* LABEL FOR EMPLOYEE RATE */}
                <p> Hourly Rate: ${rate}</p>


                {/* INPUT FOR BUDGET */}

                <Form_auto_input 
                    column_info={{
                        column_name: `budget`,
                        is_nullable: "yes",
                        input_type: "budget"
                    }}
                    table_data_object={{[`budget`]: employee_budget}} 
                    send_table_data = {({input, db_column}:Types_input_change)=>{
                        handle_input_change({input:input, db_column:db_column})
                    }}
                />

                {/* INPUT FOR HOURS */}
                <Form_auto_input 
                    column_info={{
                        column_name: `hours`,
                        is_nullable: "yes",
                        input_type: "text"
                    }}
                    table_data_object={{[`hours`]: employee_hours}}
                    send_table_data = {({input, db_column}:Types_input_change)=>{
                        handle_input_change({input:input, db_column:db_column})
                    }}
                />
            </div>
            
            {/* BUTTON TO REMOVE EMPLOYEE */}
            <div
                className="e_select_del_btn"
                onClick={()=>handle_remove_employee()}
            >X</div>
        </div>
    ); 
}