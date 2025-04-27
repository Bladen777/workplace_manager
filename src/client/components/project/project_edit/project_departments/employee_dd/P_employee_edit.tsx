import { useCallback, useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS 
import { Use_Process_input_data } from "../../../../_universal/Process_input_data.js";
import { Use_Context_project_data } from "../../../context/Context_project_data.js";
import { Use_Context_project_budgets } from "../../../context/Context_project_budgets.js";
import { Use_Context_employee_data } from "./context/Context_employee_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js";


// TYPE DEFINITIONS
import { Types_input_change } from "../../../../_universal/inputs/Form_auto_input.js";
import { Types_form_data } from "../../../../control_panel/context/Context_db_table_info.js";
import { Types_search_item } from "../../../../_universal/drop_downs/Input_drop_down.js";
import { Types_project_dates } from "../../Edit_project.js";


interface Types_props{
    employee_id: number; 
    dep_id:number;
    data:Types_form_data;
    dep_dates: Types_project_dates;
    rate:number;
    remove_employee: Function;
}

interface Types_employee_data{
    budget:number;
    budget_hours:number;
}

// THE COMPONENT 
export default function P_employee_edit({dep_id, employee_id, data, dep_dates, rate, remove_employee}:Types_props) {
    console.log(`       %c INPUT_COMPONENT `, `background-color:${ log_colors.input_component }`, `P_employee_edit`);

    const dep_id_name = `dep_id_${dep_id}`
    const existing_project_data = useContext(Use_Context_project_data).show_context;

    const existing_employee_data = existing_project_data.current_project.employee_budgets.find((entry:Types_form_data)=>{
        //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for entry`,'\n' ,entry);
        if(entry.employee_id === employee_id){
            return entry
        }
    })
    const initial_employee_form_data:Types_form_data = (
        existing_project_data.submit_method === "edit"
        ? existing_employee_data!
        : existing_project_data.table_info.employee_budgets.initial_form_data
    )

    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for initial_employee_form_data`,'\n' ,initial_employee_form_data);

    const department_budget = useContext(Use_Context_project_budgets).show_context.departments[dep_id_name]
    const employee_data = useContext(Use_Context_employee_data).show_context;

    const update_employee_data = useContext(Use_Context_employee_data).update_func;

    const [employee_budget, set_employee_budget] = useState<number>(Number(initial_employee_form_data!.budget));
    const [employee_hours, set_employee_hours] = useState<number>(Number(initial_employee_form_data!.budget_hours));

    const employee_data_ref = useRef<Types_employee_data>({
        budget:0,
        budget_hours:0
    })


    const e_select_box_ele = useRef<HTMLDivElement | null>(null);

    const callback_handle_budget_change = useCallback(({input, db_column}:Types_input_change) =>{
      handle_budget_input_change({input, db_column})
    },[])

    function handle_budget_input_change({input, db_column}:Types_input_change){
        
        let update_budget:number = employee_data_ref.current!.budget;
        let update_hours:number = employee_data_ref.current!.budget_hours;

        if(db_column === "hours"){
            update_hours = Number(input);
            update_budget = Number((update_hours * rate).toFixed(2));
        } else {
            update_budget = Number(input);
            update_hours = Number((update_budget/rate).toFixed(2));
        }

        employee_data_ref.current = {
            budget: update_budget,
            budget_hours: update_hours
        }

        set_employee_budget(update_budget);
        set_employee_hours(update_hours);

        
    
        const budget_form_data:Types_form_data = {
            budget_hours: update_hours,
            budget: update_budget,
            employee_id: employee_id,
            department_id: dep_id,    
        }

        update_employee_data.now(budget_form_data);
    }

    const callback_handle_date_change = useCallback(({input, db_column}:Types_input_change) =>{
        handle_date_input_change({input, db_column})
      },[])

    function handle_date_input_change({input, db_column}:Types_input_change){
        const date_form_data:Types_form_data = {
            employee_id: employee_id,
            department_id: dep_id,
            start_date: input
        }

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for date_form_data`,'\n' ,date_form_data);
        update_employee_data.now(date_form_data); 

    }

    function handle_remove_employee(){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for remove employee`);
        update_employee_data.now({method:"delete", department_id: dep_id, employee_id:employee_id }); 
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


// RETURNED VALUES 
    return(
        <div 
            ref = {e_select_box_ele}
            className={
                employee_budget > department_budget
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


                <Form_auto_input
                    column_info = {{
                        column_name: "start_date",
                        is_nullable: "YES",
                        input_type: "date"
                    }}
                    initial_data_object={initial_employee_form_data!}
                    date_range={{min: dep_dates.start_date, max: dep_dates.finish_date}}
                    send_table_data = {callback_handle_date_change}
                />
              
                {/* INPUT FOR BUDGET */}

                <Form_auto_input 
                    column_info={{
                        column_name: `budget`,
                        is_nullable: "YES",
                        input_type: "budget"
                    }}
                    initial_data_object={initial_employee_form_data!}
                    adjust_data_object={{[`budget`]: employee_budget.toFixed(2)}} 
                    send_table_data = {callback_handle_budget_change}
                />

                {/* INPUT FOR HOURS */}
                <Form_auto_input 
                    column_info={{
                        column_name: `budget_hours`,
                        is_nullable: "YES", 
                        input_type: "text"
                    }}
                    initial_data_object={initial_employee_form_data!}
                    adjust_data_object={{[`budget_hours`]: employee_hours}}
                    send_table_data = {callback_handle_budget_change}
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