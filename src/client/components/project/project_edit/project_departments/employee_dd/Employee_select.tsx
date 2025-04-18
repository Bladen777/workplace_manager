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

interface Types_props{
    department_name:string;
    department_budget:number;
}


// THE COMPONENT 
export default function Employee_select({department_name, department_budget}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `employees_select for: `, department_name);

    const current_project = useContext(Use_Context_project_data).show_context.current_project;

    const [initial_employee_list, set_initial_employee_list] = useState<Types_form_data[]>([])
    const [employee_list, set_employee_list] = useState<Types_form_data[]>([])
    const [selected_employees, set_selected_employees] = useState<ReactElement[]>([]);
    const selected_employees_ref = useRef<ReactElement[]>([]);
    
    
    const dep_budget = useRef<number>(0);
    dep_budget.current = department_budget;


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
        if(employee_pay_type === "annually"){
            employee_rate = Number((Number(selected_employee!.pay_rate)/2080).toFixed(2));
        } else {
            employee_rate = Number(selected_employee!.pay_rate);
        }
        
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for item.id`,'\n' ,item.id);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for employee_rate`,'\n' ,employee_rate);

        const employee_input = <P_employee_edit
            key={`${item.id}`}
            department_budget = {()=>get_dep_budget()}
            data = {item}
            rate = {employee_rate}
            remove_employee = {()=>remove_employee(item.id!)}
        />

        const update_selected_employees = [...selected_employees, employee_input];

        set_selected_employees(update_selected_employees);
        selected_employees_ref.current = update_selected_employees;
        update_employee_list()
    }

    function remove_employee(id:number){
        
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for id`,'\n' ,id);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for selected_employees`,'\n' ,selected_employees_ref.current);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for selected_employees`,'\n' ,selected_employees_ref.current[0].key);

        let remaining_selected_employees:ReactElement[] = [];

        [...selected_employees_ref.current].forEach((item)=>{
            if(Number(item.key) !== id){
                remaining_selected_employees.push(item)
            }
        })

        set_selected_employees(remaining_selected_employees);
        selected_employees_ref.current = remaining_selected_employees;
        update_employee_list()

    }

    function update_employee_list(){

        let remaining_employees:Types_form_data[] = [] 
        initial_employee_list.forEach((employee_data)=>{
            let employee_selected:boolean = false;
            [...selected_employees_ref.current].forEach((selected_employee_data)=>{
                if(employee_data.id === Number(selected_employee_data.key)){
                    employee_selected = true;
                }
            })
            if(!employee_selected){
                remaining_employees.push(employee_data);
            }
        })
        if(selected_employees_ref.current.length === 0){
            remaining_employees = initial_employee_list;
        }

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for remaining_employees`,'\n' ,remaining_employees);
        set_employee_list(remaining_employees);
    }

    function get_dep_budget(){
        return dep_budget.current
    }



// MEMOS AND EFFECTS    
    useEffect(() =>{
      fetch_initial_employee_list()
    },[])


    



// RETURNED VALUES 
    return(
        <label className="form_dd auto_form_input pd_employee_dd">
            <p>Selected Employees</p>
            <div className="selected_employees">
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