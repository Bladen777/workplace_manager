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
    employee_data:Types_form_data;
    department_dates: Types_project_dates;
    remove_employee: Function;
}

interface Types_p_employee_budget{
    [key:string]:number;
    budget:number;
    budget_hours:number;
}

// THE COMPONENT 
export default function P_employee_edit({dep_id, employee_id, employee_data, department_dates, remove_employee}:Types_props) {
    const initial_render = useRef<boolean>(true);
    console.log(`       %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `P_employee_edit`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const department_budget = useContext(Use_Context_project_budgets).show_context.departments[`dep_id_${dep_id}`];

    const update_employee_data = useContext(Use_Context_employee_data).update_func;

    const exisiting_p_employee = initial_data["project_employees"].data.find((entry)=>{
        if(entry["employee_id"] === employee_id && entry["department_id"] === dep_id){
            return entry;
        };
    });
    const initial_employee_form_data = (
        exisiting_p_employee && active_entry.submit_method === "edit" 
        ? exisiting_p_employee 
        : initial_data["project_employees"].info.form_data
    );

    const [employee_start_date_adjust, set_employee_start_date_adjust] = useState<string | undefined>(
        initial_employee_form_data["start_date"] 
        ? String(initial_employee_form_data["start_date"]!) 
        : undefined
    )

    const [p_employee_budget, set_p_employee_budget] = useState<Types_p_employee_budget>({
        budget:Number(initial_employee_form_data.budget),
        budget_hours:Number(initial_employee_form_data.budget_hours)
    })


    const employee_rate:number = (
        employee_data!.pay_type === "anually"
        ? Number((Number(employee_data!.pay_rate)/2080).toFixed(2))
        : Number(employee_data!.pay_rate)
    );


    const e_select_box_ele = useRef<HTMLDivElement | null>(null);

    const callback_handle_budget_change = useCallback(({input, db_column}:Types_input_change) =>{
      handle_budget_input_change({input, db_column})
    },[])

    async function handle_budget_input_change({input, db_column}:Types_input_change){
        let budget_form_data:Types_form_data = {};
        set_p_employee_budget((prev_vals)=>{

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

            budget_form_data = {
                budget_hours: update_data.budget_hours,
                budget: update_data.budget,
                employee_id: employee_id,
                department_id: dep_id,    
            }

            console.log(`%c DATA `, `${ log_colors.data }`,`for update_data`,'\n' ,update_data);
            return update_data;
        })

        await update_employee_data.wait(budget_form_data);
    }

    const callback_handle_date_change = useCallback(({input, db_column}:Types_input_change) =>{
        handle_date_input_change({input, db_column})
      },[])

    async function handle_date_input_change({input, db_column}:Types_input_change){
        const date_form_data:Types_form_data = {
            employee_id: employee_id,
            department_id: dep_id,
            start_date: input
        }

        //set_employee_start_date_adjust({start_date:input})
        console.log(`%c DATA `, `${ log_colors.data }`,`for date_form_data`,'\n' ,date_form_data);
        await update_employee_data.wait(date_form_data); 

    }

    async function handle_remove_employee(){
        console.log(`%c DATA `, `${ log_colors.data }`,`for remove employee`);
        await update_employee_data.wait({method:"delete", department_id: dep_id, employee_id:employee_id }); 
        e_select_box_ele.current!.style.animation = `toggle_e_select_box 1s ease reverse forwards`;
        e_select_box_ele.current!.addEventListener("animationend", open_animation_ended);
        function open_animation_ended(){
            e_select_box_ele.current!.removeEventListener("animationend", open_animation_ended);
            remove_employee()
        }
    }


// MEMOS AND EFFECTS

    useEffect(() =>{
        (async()=>{
            e_select_box_ele.current!.style.animation = `toggle_e_select_box 1s ease normal forwards`;
            e_select_box_ele.current!.addEventListener("animationend", close_animation_ended);

            console.log(`%c IMPORTANT `, `${ log_colors.important }`,`for initial_employee_form_data.start_date`,'\n' ,initial_employee_form_data.start_date);
            console.log(`%c IMPORTANT `, `${ log_colors.important }`,`for department_dates`,'\n' ,department_dates);

            let employee_start_date  = initial_employee_form_data.start_date;

            if(!initial_employee_form_data.start_date){
                console.log(`%c DATA `, `${ log_colors.important_2 }`,`for initial_employee_form_data["start_date"]`,'\n' ,initial_employee_form_data["start_date"]);
                set_employee_start_date_adjust(department_dates.start_date)
                if(department_dates.start_date){
                    employee_start_date = department_dates.start_date;
                }
            }

            console.log(`%c DATA `, `${ log_colors.data }`,`for employee_data`,'\n' ,employee_data);
            const added_employee_data:Types_form_data = {
                id: exisiting_p_employee ? exisiting_p_employee.id : - 1,
                budget_hours: p_employee_budget.budget_hours,
                budget: p_employee_budget.budget,
                employee_id: employee_id,
                department_id: dep_id,  
                start_date: employee_start_date
            }
            
            await update_employee_data.wait(added_employee_data);

            function close_animation_ended(){
                e_select_box_ele.current!.removeEventListener("animationend", close_animation_ended);
                e_select_box_ele.current!.style.animation ="";
            }

            initial_render.current = false;

        })()
    },[])

    useMemo(() =>{
        if(!initial_render.current){
            console.log(`%c IMPORTANT `, `${ log_colors.important }`,`for department_dates`,'\n' ,department_dates);
            const prev_start_date = employee_start_date_adjust!;
            let update_start_date = employee_start_date_adjust;

    
            const start_date_time = (new Date(department_dates.start_date!)).getTime();
            const finish_date_time = (new Date(department_dates.finish_date!)).getTime();
    
            const employee_start_time = (new Date(prev_start_date)).getTime();

/*
            console.log(`%c ADJUST DATE VALUES `, `${ log_colors.data }`,
                '\n' , `start_date_time: ${start_date_time} vs employee_start_time: ${employee_start_time}`,
                '\n' , `finish_date_time: ${finish_date_time} vs employee_start_time: ${employee_start_time}`,
            );

*/
            if(start_date_time > employee_start_time || (department_dates.start_date !== undefined && prev_start_date === undefined)){
                update_start_date = department_dates.start_date;
                update_employee_data.wait({department_id: dep_id, employee_id:employee_id, start_date: department_dates.start_date})
            };
    
            if(finish_date_time < employee_start_time || (department_dates.finish_date !== undefined && prev_start_date === undefined)){
                update_start_date = department_dates.finish_date;
                update_employee_data.wait({department_id: dep_id, employee_id:employee_id, start_date: department_dates.finish_date})
            };
            console.log(`%c DATA `, `${ log_colors.data }`,`for update_start_date`,'\n' ,update_start_date);
                
            set_employee_start_date_adjust(update_start_date)
        }
    },[department_dates])

    //dep_id, employee_id, employee_data, department_dates, remove_employee
    useMemo(() =>{
        if(!initial_render.current){
            console.log(`%c DEP_ID CHANGED `, `${ log_colors.update}`, dep_id);
        }
    },[dep_id]);

    useMemo(() =>{
        if(!initial_render.current){
            console.log(`%c EMPLOYEE_ID CHANGED `, `${ log_colors.update}`, employee_id);
        }
    },[employee_id]);

    useMemo(() =>{
        if(!initial_render.current){
            console.log(`%c EMPLOYEE_DATA CHANGED`, `${ log_colors.update}`, employee_data);
        }
    },[employee_data]);

    useMemo(() =>{
        if(!initial_render.current){
            console.log(`%c DEPARTMENT_DATES CHANGED `, `${ log_colors.update}`, department_dates);
        }
    },[department_dates]);

    useMemo(() =>{
        if(!initial_render.current){
            console.log(`%c REMOVE_EMPLOYEE CHANGED `, `${ log_colors.update}`, remove_employee);
        }
    },[remove_employee]);



// RETURNED VALUES 
    return(
        <div 
            ref = {e_select_box_ele}
            className={
                p_employee_budget.budget > department_budget
                ? "over_budget e_select_box"
                : "e_select_box" 
            }
        >
            {/* LABEL FOR NAME */}
            <h3>{employee_data.name}</h3>

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
                    adjust_data_value={employee_start_date_adjust}
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
                    adjust_data_value={p_employee_budget.budget_hours}
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
                    adjust_data_value={p_employee_budget.budget} 
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