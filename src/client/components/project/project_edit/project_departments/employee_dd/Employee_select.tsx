import { memo, ReactElement, useCallback, useContext, useEffect, useMemo,  useRef,  useState } from "react";
import axios from "axios";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js"
  import "../../../../../styles/project_edit/employee_select.css"

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../../context/Context_active_entry.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 
import P_employee_edit from "./P_employee_edit.js";
import Input_drop_down from "../../../../_universal/drop_downs/Input_drop_down.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../../../context/Context_initial_data.js";
import { Types_search_item } from "../../../../_universal/drop_downs/Input_drop_down.js";
import { Types_department_data } from "../../../../context/Context_departments_data.js";
import { Types_project_dates } from "../../Edit_project.js";

interface Types_props{
    department_data: Types_department_data;
    dep_start_date: string | undefined;
    dep_finish_date: string | undefined;
}


// THE COMPONENT 
function Employee_select({department_data, dep_start_date, dep_finish_date}:Types_props) {
    console.log(`      %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `employee_select for: `, department_data.name);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;

    const initial_employee_list = useRef<Types_form_data[]>([])
    const [employee_list, set_employee_list] = useState<Types_form_data[]>([])

    const [selected_employee_data, set_selected_employee_data] = useState<Types_form_data[]>([])
    
    const dep_id = `dep_id_${department_data.id}`

    // GET CURRENT LIST OF MATCHING EMPLOYEES
    async function fetch_initial_employee_list(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "employee_departments",
                sort_field: "employee_id",
                filter_key: `"${dep_id}"`,
                filter_item: "1"

            })
            const employee_ids = response.data;
            let employee_data = [];
            for await(let item of employee_ids){
                try{
                 
                    const response = await axios.post("/get_table_info",{
                        table_name: "employees",
                        filter_key: "id",
                        filter_item: `${item.employee_id}`
        
                    })
                 
                    employee_data.push(response.data[0]);
                } catch (error){
                  console.log(`%c  has the following error: `, 'darkred', error); 
                };
            };
            //console.log(`%c DATA `, `${ log_colors.important }`,`for employee_data for ${department_data.name}`,'\n' ,employee_data);


            // CHECK IF THERE ARE EXISTING EMPLOYEES ASIGNED TO THIS PROJECT
            function fetch_selected_employees(){
                let employee_selected:boolean = false;
                initial_data["project_employees"].data.forEach((item:Types_form_data)=>{
                    if(item.department_id === department_data.id){
                        add_employee({entry_id:Number(item.employee_id!)});
                        employee_selected = true;
                    }
                })
                return employee_selected;
            }

            initial_employee_list.current = employee_data;
            const employee_selected:boolean = active_entry.submit_method === "edit" ? fetch_selected_employees() : false;

            !employee_selected && set_employee_list(employee_data)
        } catch (error){
          console.log(`%c  has the following error: `, 'darkred', error); 
        };    
    }

    function add_employee({entry_id}:{entry_id:number}){
        if(entry_id !== 0){
            set_selected_employee_data((prev_vals)=>{
                const selected_employee = initial_employee_list.current.find((s_entry)=>{
                    if(s_entry.id === entry_id){
                        return s_entry;
                    }
                })
        
                const update_selected_employees = [...prev_vals, selected_employee!];
                update_employee_list({f_employee_list:update_selected_employees});
                return update_selected_employees;

            }); 
        }
    }

    function update_employee_list({f_employee_list}:{f_employee_list:Types_form_data[]}){

        const scan_employee_list = f_employee_list ? f_employee_list :selected_employee_data;

        let remaining_employees:Types_form_data[] = [] 
        initial_employee_list.current.forEach((employee_data)=>{
            let employee_selected:boolean = false;
            scan_employee_list.forEach((s_employee_data)=>{
                if(employee_data.id === s_employee_data.id){
                    employee_selected = true;
                }
            })
            if(!employee_selected){
                remaining_employees.push(employee_data);
            }
        })
        if(scan_employee_list.length === 0){
            remaining_employees = initial_employee_list.current;
        }

        console.log(`%c DATA `, `${ log_colors.data }`,`for remaining_employees`,'\n' ,remaining_employees);
        set_employee_list(remaining_employees);
    }

    const callback_remove_employee = useCallback((id:number)=>{
        console.log(`%c DATA `, `${ log_colors.data }`,`for id`,'\n' ,id);
        let remaining_selected_employees:Types_form_data[] = [];
        selected_employee_data.forEach((item)=>{
            if(item.id !== id){
                remaining_selected_employees.push(item)
            }
        })

        update_employee_list({f_employee_list:remaining_selected_employees});
        set_selected_employee_data(remaining_selected_employees);
    },[selected_employee_data])


// MEMOS AND EFFECTS    


    useMemo(() => { 
        fetch_initial_employee_list()
    },[])

/*
    useMemo(() =>{
        console.log(`%c DEPARTMENT_DATES CHANGED `, `${ log_colors.update}`); 
    },[dep_start_date, dep_finish_date]);
*/


// RETURNED VALUES
    if(employee_list.length !== 0 || selected_employee_data.length !== 0){
        return(
            <label className="form_dd auto_form_input pd_employee_dd">
                    <p>Selected Employees</p>
                    <div className="selected_employees">
                        {selected_employee_data.map((entry:Types_form_data)=>{
                            return (
                                <P_employee_edit
                                    key={`${entry.id}`}
                                    dep_id = {department_data.id}
                                    employee_id={entry.id!}
                                    employee_data = {entry}
                                    dep_start_date = {dep_start_date}
                                    dep_finish_date = {dep_finish_date}
                                    remove_employee = {callback_remove_employee}
                                />
                            )
                        })}
                    </div>
                {employee_list.length !== 0
                    ?
                    <Input_drop_down 
                        placeholder="Add Employee"
                        table_name={{main:"Employee", specific:dep_id}} 
                        form_table_data={employee_list} 
                        send_table_data={({input}:{input:Types_search_item})=>{
                            add_employee({entry_id:input.id!})
                        }}                    
                    />
                    :
                    <p>All Employees Selected</p>
                }
            </label>
        ); 
    } else {
        return (<p>No Employees in Department</p>)
    }
    
}
export default memo(Employee_select);