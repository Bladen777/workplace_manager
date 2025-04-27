import { ReactElement, useContext, useEffect, useMemo,  useRef,  useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 
import P_employee_edit from "./P_employee_edit.js";
import Input_drop_down from "../../../../_universal/drop_downs/Input_drop_down.js";

// CONTEXT IMPORTS 
import { Use_Context_project_data } from "../../../context/Context_project_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js"
  import "../../../../../styles/project/employee_select.css"

// TYPE DEFINITIONS
import { Types_form_data } from "../../../../control_panel/context/Context_db_table_info.js";
import { Types_search_item } from "../../../../_universal/drop_downs/Input_drop_down.js";
import { Types_input_change } from "../../../../_universal/inputs/Form_auto_input.js";
import { Types_department_data } from "../../../../context/Context_departments_data.js";
import { Types_project_dates } from "../../Edit_project.js";

interface Types_props{
    department_data: Types_department_data;
    dep_dates: Types_project_dates;
}


// THE COMPONENT 
export default function Employee_select({department_data, dep_dates}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `employees_select for: `, department_data.name);

    const existing_project_data = useContext(Use_Context_project_data).show_context;
    const current_project = existing_project_data.current_project;

    const [initial_employee_list, set_initial_employee_list] = useState<Types_form_data[]>([])
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
                  console.log(`%c  has the following error: `, 'background-color:darkred', error); 
                };
            };
            //console.log(`%c DATA `, `background-color:${ log_colors.important }`,`for employee_data for ${department_name}`,'\n' ,employee_data);
            set_initial_employee_list(employee_data);
            set_employee_list(employee_data);
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };    
    }

    // CHECK IF THERE ARE EXISTING EMPLOYEES ASIGNED TO THIS PROJECT
    async function fetch_selected_employees(){
        existing_project_data.current_project.employee_budgets.forEach((item:Types_form_data)=>{
            if(item.department_id === department_data.id){
                add_employee({entry_id:Number(item.employee_id!)});
            }

        })
    }

    function add_employee({entry_id}:{entry_id:number}){
        const selected_employee = initial_employee_list.find((s_entry)=>{
            if(s_entry.id === entry_id){
                return s_entry;
            }
        })

        const update_selected_employees = [...selected_employee_data, selected_employee!];
        update_employee_list({f_employee_list:update_selected_employees});
        set_selected_employee_data(update_selected_employees);
    }

    function remove_employee(id:number){
        
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for id`,'\n' ,id);

        let remaining_selected_employees:Types_form_data[] = [];

        selected_employee_data.forEach((item)=>{
            if(item.id !== id){
                remaining_selected_employees.push(item)
            }
        })

        
        update_employee_list({f_employee_list:remaining_selected_employees});
        set_selected_employee_data(remaining_selected_employees);
    }

    function update_employee_list({f_employee_list}:{f_employee_list:Types_form_data[]}){

        const scan_employee_list = f_employee_list ? f_employee_list :selected_employee_data;

        let remaining_employees:Types_form_data[] = [] 
        initial_employee_list.forEach((employee_data)=>{
            let employee_selected:boolean = false;
            console.log(`%c EMPLOYEE SELECT ADJUST `, `background-color:${ log_colors.important }`,`for employee_data.id`,'\n' ,employee_data.id);
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for scan_employee_list`,'\n' ,scan_employee_list);
            scan_employee_list.forEach((s_employee_data)=>{
                console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for scan_employee_list.id`,'\n' ,s_employee_data.id);
                if(employee_data.id === s_employee_data.id){
                    employee_selected = true;
                }
            })
            if(!employee_selected){
                remaining_employees.push(employee_data);
            }
        })
        if(scan_employee_list.length === 0){
            remaining_employees = initial_employee_list;
        }

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for remaining_employees`,'\n' ,remaining_employees);
        set_employee_list(remaining_employees);
    }


// MEMOS AND EFFECTS    
    useEffect(() => { 
        fetch_initial_employee_list()
    },[])


    useMemo(() => {
        if(existing_project_data.submit_method === "edit" && initial_employee_list.length !== 0){
            const animating_ele = document.getElementById("edit_project_input_box");
            animating_ele?.addEventListener("animationend", animation_finished);
            
            function animation_finished(){
                    fetch_selected_employees() 
                    animating_ele?.removeEventListener("animationend", animation_finished);
            }
        }
    },[initial_employee_list])

/*
    useMemo(() =>{
        console.log(`%c IMPORTANT `, `background-color:${ log_colors.important }`,`for dep_dates`,'\n' ,dep_dates);
    },[dep_dates])
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
                            data = {entry}
                            dep_dates = {dep_dates}
                            remove_employee = {()=>remove_employee(entry.id!)}
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