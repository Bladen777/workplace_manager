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

// TYPE DEFINITIONS
import { Types_form_data } from "../../../../control_panel/context/Context_db_table_info.js";
import { Types_search_item } from "../../../../_universal/drop_downs/Input_drop_down.js";
import { Types_input_change } from "../../../../_universal/inputs/Form_auto_input.js";

interface Types_props{
    department_name:string;
}


// THE COMPONENT 
export default function Employee_select({department_name}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `employees_dd for: `, department_name);

    const current_project = useContext(Use_Context_project_data).show_context.current_project;

    const [initial_employee_list, set_initial_employee_list] = useState<Types_form_data[]>([])
    const [employee_list, set_employee_list] = useState<Types_form_data[]>([])
    const [selected_employees, set_selected_employees] = useState<ReactElement[]>([]);


    // CHECK IF THERE ARE EXISTING EMPLOYEES ASIGNED TO THIS PROJECT
    async function fetch_selected_employees(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "employee_budgets",
                filter_key: "project_id",
                filter_item: `"${current_project.current_table_item.id}"`
            })

        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };

    }

    // GET CURRENT LIST OF MATCHING EMPLOYEES
    async function fetch_initial_employee_list(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "employee_departments",
                sort_field: "employee_id",
                filter_key: `"${department_name}"`,
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

    function add_employee(item:Types_search_item){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for item`,'\n' ,item);

        const selected_employee = initial_employee_list.find((s_item)=>{
            if(s_item.id === item.id){
                return s_item;
            }
        })
        const employee_pay_type:string = String(selected_employee!.pay_type); 

        let employee_rate:number;
        if(employee_pay_type === "hourly"){
            employee_rate = Number(selected_employee!.pay_rate);
        } else {
            employee_rate = Number((Number(selected_employee!.pay_rate)/2080).toFixed(2));
        }
        

        const employee_input = <P_employee_edit
            key={`${item.name}`} 
            data = {item}
            rate = {employee_rate}
            remove_employee = {(id:number)=>remove_employee(id)}
        />

        let remaining_employees:Types_form_data[] = [] 
        employee_list.forEach((employee_data)=>{
            if(employee_data.id !== item.id){
                remaining_employees.push(employee_data)
            }
        })

        set_employee_list(remaining_employees);
        set_selected_employees(prev_state => {
            return[
                ...prev_state,
                employee_input
            ]
        });
    }

    function remove_employee(id:number){
        let remaining_selected_employees:ReactElement[] = [];
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for selected_employees`,'\n' ,selected_employees);

    }


// MEMOS AND EFFECTS    
    useEffect(() =>{
      fetch_initial_employee_list()
    },[])

// RETURNED VALUES 
    return(
        <label className="form_dd auto_form_input pd_employee_dd">
            <p>Selected Employees</p>
            <div>
                {selected_employees}
            </div>
            <Input_drop_down 
                table_name={{main:"Employee", specific:department_name}} 
                form_table_data={employee_list} 
                send_table_data={({input}:{input:Types_search_item})=>{
                    add_employee(input)
                }}                    
            />
        </label>
    ); 
}