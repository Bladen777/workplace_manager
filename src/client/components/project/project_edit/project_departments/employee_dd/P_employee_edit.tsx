import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../../context/Context_active_entry.js";
import { Use_Context_project_budgets } from "../../../context/Context_project_budgets.js";
import { Use_Context_employee_data } from "./context/Context_employee_data.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 
import Form_auto_input from "../../../../_universal/inputs/Form_auto_input.js";

// TYPE DEFINITIONS
import { Types_input_change } from "../../../../_universal/inputs/Form_auto_input.js";
import { Types_form_data } from "../../../../context/Context_initial_data.js";
import { Types_search_item } from "../../../../_universal/drop_downs/Input_drop_down.js";
import { Types_project_dates } from "../../Edit_project.js";


interface Types_props{
    employee_id: number; 
    dep_id:number;
    data:Types_form_data;
    department_dates: Types_project_dates;
    remove_employee: Function;
}

interface Types_project_employees{
    [key:string]:number;
    budget:number;
    budget_hours:number;
}

// THE COMPONENT 
export default function P_employee_edit({dep_id, employee_id, data, department_dates, remove_employee}:Types_props) {
    console.log(`       %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `P_employee_edit`);

    const dep_id_name = `dep_id_${dep_id}`

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const department_budget = useContext(Use_Context_project_budgets).show_context.departments[dep_id_name];

    const update_employee_data = useContext(Use_Context_employee_data).update_func;

    const p_employee_data = initial_data["project_employees"];

    const exisiting_p_employee = p_employee_data.data.find((entry)=>{
        if(entry["employee_id"] === employee_id && entry["department_id"] === dep_id){
            return entry;
        };
    });
    const initial_employee_form_data = (
        exisiting_p_employee && active_entry.submit_method === "edit" 
        ? exisiting_p_employee 
        : p_employee_data.info.form_data
    );

    const [project_employees, set_project_employees] = useState<Types_project_employees>({
        budget:Number(initial_employee_form_data.budget),
        budget_hours:Number(initial_employee_form_data.budget_hours)
    })


    let employee_rate:number;
    if(data!.pay_type === "annually"){
        employee_rate = Number((Number(data!.pay_rate)/2080).toFixed(2));
    } else {
        employee_rate = Number(data!.pay_rate);
    }


    const e_select_box_ele = useRef<HTMLDivElement | null>(null);

    const callback_handle_budget_change = useCallback(({input, db_column}:Types_input_change) =>{
      handle_budget_input_change({input, db_column})
    },[])

    function handle_budget_input_change({input, db_column}:Types_input_change){
        set_project_employees((prev_vals)=>{

            console.log(`%c DATA `, `${ log_colors.data }`,`for db_column`,'\n' ,db_column);
            console.log(`%c DATA `, `${ log_colors.data }`,`for input`,'\n' ,input);
            const update_data = {...prev_vals}

            if(db_column === "budget_hours"){
                update_data.budget_hours = Number(input);
                update_data.budget = Number((update_data.budget_hours * employee_rate).toFixed(2));
            } else {
                update_data.budget = Number(input);
                update_data.budget_hours = Number((update_data.budget/employee_rate).toFixed(2));
            }

            const budget_form_data:Types_form_data = {
                budget_hours: update_data.budget_hours,
                budget: update_data.budget,
                employee_id: employee_id,
                department_id: dep_id,    
            }

            update_employee_data.now(budget_form_data);
            console.log(`%c DATA `, `${ log_colors.data }`,`for update_data`,'\n' ,update_data);
            return update_data;
        })
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

        console.log(`%c DATA `, `${ log_colors.data }`,`for date_form_data`,'\n' ,date_form_data);
        update_employee_data.now(date_form_data); 

    }

    function handle_remove_employee(){
        console.log(`%c DATA `, `${ log_colors.data }`,`for remove employee`);
        update_employee_data.now({method:"delete", department_id: dep_id, employee_id:employee_id }); 
        e_select_box_ele.current!.style.animation = `toggle_e_select_box 1s ease reverse forwards`;
        e_select_box_ele.current!.addEventListener("animationend", open_animation_ended);
        function open_animation_ended(){
            e_select_box_ele.current!.removeEventListener("animationend", open_animation_ended);
            remove_employee()
        }
    }

// MEMOS AND EFFECTS

    useEffect(() =>{
        e_select_box_ele.current!.style.animation = `toggle_e_select_box 1s ease normal forwards`;
        e_select_box_ele.current!.addEventListener("animationend", close_animation_ended);

        console.log(`%c DATA `, `${ log_colors.data }`,`for data`,'\n' ,data);
        const added_employee_data:Types_form_data = {
            id: exisiting_p_employee ? exisiting_p_employee.id : - 1,
            budget_hours: project_employees.budget_hours,
            budget: project_employees.budget,
            employee_id: employee_id,
            department_id: dep_id,  
            start_date: initial_employee_form_data.start_date 
        }
        
        const employee_data_update = update_employee_data.wait(added_employee_data);

        function close_animation_ended(){
            e_select_box_ele.current!.removeEventListener("animationend", close_animation_ended);
            e_select_box_ele.current!.style.animation ="";
            update_employee_data.update_context(employee_data_update);
        }

    },[])


    useMemo(() =>{
      console.log(`%c IMPORTANT `, `${ log_colors.important }`,`for department_dates`,'\n' ,department_dates);
    },[department_dates])

    /*

    useEffect(() =>{
    console.log(`%c DATA `, `${ log_colors.data }`,`for data`,'\n' ,data);
    },[data])



    useEffect(() =>{
        console.log(`%c DATA `, `${ log_colors.data }`,`for remove_employee`,'\n' ,remove_employee);
    },[remove_employee])  
    */


// RETURNED VALUES 
    return(
        <div 
            ref = {e_select_box_ele}
            className={
                project_employees.budget > department_budget
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
                <p> Hourly Rate: ${employee_rate}</p>


                <Form_auto_input
                    column_info = {{
                        column_name: "start_date",
                        is_nullable: "YES",
                        input_type: "date"
                    }}
                    initial_data_object={initial_employee_form_data}
                    date_range={{min: department_dates.start_date, max: department_dates.finish_date}}
                    send_table_data = {callback_handle_date_change}
                />
                {/* INPUT FOR HOURS */}
                <Form_auto_input 
                    column_info={{
                        column_name: `budget_hours`,
                        is_nullable: "YES", 
                        input_type: "text"
                    }}
                    initial_data_object={initial_employee_form_data}
                    adjust_data_object={project_employees}
                    send_table_data = {callback_handle_budget_change}
                />
              
                {/* INPUT FOR BUDGET */}

                <Form_auto_input 
                    column_info={{
                        column_name: `budget`,
                        is_nullable: "YES",
                        input_type: "budget"
                    }}
                    initial_data_object={initial_employee_form_data}
                    adjust_data_object={project_employees} 
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