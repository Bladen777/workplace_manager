import { ReactElement, useEffect, useMemo,  useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
import "../../../styles/_universal/form_dd.css"

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS
interface Types_props{
    send_table_data:Function;
    department_name:string;
}


// THE COMPONENT 
export default function Employee_dd({send_table_data, department_name}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `employees_dd for: `, department_name);

    const [employee, set_employee] = useState<string>("");
    const [employee_list, set_employee_list] = useState<string[]>([])
    const [matched_employees, set_matched_employees] = useState<ReactElement[]>([]);
    const [open_dd, set_open_dd] = useState<boolean>(false)

    // GET CURRENT LIST OF CLIENT NAMES
    async function fetch_employee_list(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "employee_departments",
                sort_field: "employee_id",
                filter_key: `"${department_name}"`,
                filter_item: "5::Bit(1)"

            })
            const employee_ids = response.data;
            console.log(`%c DATA `, `background-color:${ log_colors.important }`,`employee_ids for ${department_name}`,'\n' ,employee_ids);
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
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for employee_data for ${department_name}`,'\n' ,employee_data);

        
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };

        
        
    }

    function handle_input_change({value}:{value:string}){
        if(value === "" || value === undefined){
            send_table_data({input: "", db_column:"client_name"})
            set_open_dd(false)
        }else{
            set_open_dd(true)
        }
        set_employee(value)
     
    }

    useMemo(()=>{
        const searched_employees: string[] = [];
        employee_list.forEach((item:string)=>{
            const search_employee_name = employee.toLowerCase();
            const employee_name:string = item.toLowerCase();
            if(employee_name.includes(search_employee_name)){
                searched_employees.push(item)
            }
        });

        if(searched_employees.length > 0){
            const new_list:ReactElement[] = searched_employees.map((item:string, index:number)=>{
                return(
                    <button
                        key={`dd_input_${index}`}
                        type="button"
                        className="form_dd_list_btn"
                        onClick={()=>{
                            set_employee(item)
                            set_open_dd(false)
                            send_table_data({input: item, db_column:"employee_name"})
                        }}
                    >
                        {item}
                    </button>
                )
            })
            set_matched_employees(new_list)
        }else {
            const blank_input = (
                <p 
                key={`dd_blank`}
                className="form_dd_blank_input"
                > 
                    Employee does not Exist
                </p>
            )
            set_matched_employees([blank_input])
        }

        
    },[employee])

    useEffect(() =>{
      fetch_employee_list()
    },[])

    // RETURNED VALUES 
    return(
        <label className="form_dd">
            <p>Selected Employees</p>
            <input
                className="form_dd_input"
                value={employee}
                placeholder="Employee"
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                    let value:string = e.target.value;
                    handle_input_change({value:value})
                }}

            />
            <div 
                className={`${open_dd ? "form_dd_list_open" : "form_dd_list_close"} form_dd_list`}
            >
              {matched_employees}  
            </div>

        </label>
    ); 
}