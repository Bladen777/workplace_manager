import { ReactElement, useEffect, useMemo,  useRef,  useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 
import P_employee_edit from "./P_employee_edit.js";
import Input_drop_down from "../../../../../_universal/drop_downs/Input_drop_down.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../../../styles/_log_colors.js"

// TYPE DEFINITIONS
import { Types_form_data } from "../../../../../control_panel/context/Context_db_table_info.js";
import { Types_search_item } from "../../../../../_universal/drop_downs/Input_drop_down.js";

interface Types_props{
    send_table_data:Function;
    department_name:string;
}


// THE COMPONENT 
export default function Employee_select({send_table_data, department_name}:Types_props) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `employees_dd for: `, department_name);


    const [employee_list, set_employee_list] = useState<Types_form_data[]>([])
    const [selected_employees, set_selected_employess] = useState<ReactElement[]>([]);


    // GET CURRENT LIST OF MATCHING EMPLOYEES
    async function fetch_employee_list(){
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
            set_employee_list(employee_data);
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };    
    }

    function add_employee(item:Types_search_item){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for item`,'\n' ,item);
        const selected_index:number = employee_list.findIndex((s_item:Types_form_data)=>{
            if(s_item.id === item.id){
                return s_item;
            } 
        });

        const employee_rate:number = Number(employee_list[selected_index].pay_rate);

        const employee_input = <P_employee_edit
            key={`${item.name}`} 
            name = {item.name}
            rate = {employee_rate}
        />

        set_selected_employess(prev_state => {
            return[
                ...prev_state,
                employee_input
            ]
        });
    }


// MEMOS AND EFFECTS    
    useEffect(() =>{
      fetch_employee_list()
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