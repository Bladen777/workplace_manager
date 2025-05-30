import { useContext, useEffect, useState } from "react";
import axios from "axios";
// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../../context/Context_departments_data.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS
import { Types_department_data } from "../../../context/Context_departments_data.js";

interface Types_props {
    employee_id:number
}

// THE COMPONENT 
export default function Employee_deps({employee_id}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Employee_deps`);

    const department_data = useContext(Use_Context_departments_data).show_context;

    const [employee_departments, set_employee_departments] = useState<Types_department_data[]>([]);

    async function fetch_employee_deps(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "employee_departments",
                filter_key: "employee_id",
                filter_item: employee_id
            })
            const employee_deps_data:Types_department_data[] = []; 
            
            department_data.forEach((item)=>{
                if(response.data[0][`dep_id_${item.id}`] === "1"){
                    console.log(`%c DATA `, `${ log_colors.data }`,`for item`,'\n' ,item);
                    employee_deps_data.push(item);
                }
            })
            set_employee_departments(employee_deps_data);
            
        } catch (error){
          console.log(`%c  has the following error: `, 'darkred', error); 
        };

    }

// MEMOS AND EFFECTS
    useEffect(() =>{
      fetch_employee_deps()
    },[])

// RETURNED VALUES 
    return(
        <div className="employee_deps_view_box">
            {employee_departments.map((department)=>{
                 return(
                    <div 
                        className="employee_dep_view_box" 
                        style={{backgroundColor: `${department.color}`}}
                        key={`employee_dep_view_for_${department.name}`}   
                    >
                        <p>{department.name}</p>
                    </div>
                )
            })}
        </div>
    ); 
}   