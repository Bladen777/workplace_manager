import { ReactElement, useEffect, useMemo,  useRef,  useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 
import useFindClickPosition from "../../hooks/useFindClickPosition.js";

// STYLE IMPORTS
import "../../../styles/_universal/form_dd.css"

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../control_panel/context/Context_db_table_info.js";

interface Types_props{
    send_table_data:Function;
    department_name:string;
}


// THE COMPONENT 
export default function Employee_dd({send_table_data, department_name}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `employees_dd for: `, department_name);

    const [employee, set_employee] = useState<string>("");
    const [employee_list, set_employee_list] = useState<Types_form_data[]>([])
    const [matched_employees, set_matched_employees] = useState<ReactElement[]>([]);
    const [selected_employees, set_selected_employess] = useState<ReactElement[]>([]);
    const [open_dd, set_open_dd] = useState<boolean>(false)

    const drop_down_ref = useRef<HTMLDivElement | null>(null);
    const track_click = useFindClickPosition();

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
            console.log(`%c DATA `, `background-color:${ log_colors.important }`,`for employee_data for ${department_name}`,'\n' ,employee_data);
            set_employee_list(employee_data);
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };

        
        
    }

    function handle_input_change({value}:{value:string}){
        
        if(value === "" || value === undefined){
            //send_table_data({input:"", db_column:"client_name"})
            set_open_dd(false)
        }else{
            set_open_dd(true)
        };
        set_employee(value);
      
    }

    function add_employee(item:string){


        const employee_input = (
            <div 
                key={`${item}`}
            >
                {/* LABEL FOR NAME */}
                <p>{item}</p>
                {/* INPUT FOR BUDGET */}
                <input></input>
                {/* INPUT FOR HOURS */}
                <input></input>

                {/* BUTTON TO REMOVE EMPLOYEE */}
                <button>X</button>
            </div>
        )
        set_selected_employess(prev_state => {
            return[
                ...prev_state,
                employee_input
            ]
        });
    }

    useMemo(()=>{
        const searched_employees: string[] = [];
        employee_list.forEach((item:Types_form_data)=>{
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for item`,'\n' ,item);
            let employee_name:string = "";
            if(typeof(item.name) === "string"){
                employee_name = item.name!.toLowerCase();
            }
            const search_employee_name = employee.toLowerCase();

            if(employee_name.includes(search_employee_name)){
                searched_employees.push(employee_name)
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
                            set_employee("")
                            set_open_dd(false)
                            //send_table_data({input: item, db_column:"name",})
                            add_employee(item)
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

        
    },[employee, employee_list])

    useEffect(() =>{
      fetch_employee_list()
    },[])

    useEffect(() =>{
        open_dd && track_click({
            active: true, 
            ele_pos:drop_down_ref.current?.getBoundingClientRect(), 
            update_func:(value:boolean)=>{value && set_open_dd(false)}
        })
    },[open_dd])

    // RETURNED VALUES 
    return(
        <label className="form_dd pd_employee_dd">
            <p>Selected Employees</p>
            <div ref={drop_down_ref}>
                <div>
                    {selected_employees}
                </div>
                <input
                    className="form_dd_input"
                    value={employee}
                    placeholder="Add Employee"
                    type="text"
                    onClick={()=>{set_open_dd(true)}}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                        let value:string = e.target.value;
                        handle_input_change({value:value})
                    }}

                />
                <div className={`${open_dd ? "form_dd_list_open" : "form_dd_list_close"} form_dd_list`}>
                {matched_employees}  
                </div>
            </div>
        </label>
    ); 
}