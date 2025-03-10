import { useContext, useEffect, useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_current_table_item } from "../../control_panel/context/Context_current_table_item.js";

// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_column_info } from "../../control_panel/context/Context_db_table_info.js";
import { Types_form_data } from "../../control_panel/context/Context_db_table_info.js";
import { Types_input_change } from "../inputs/Form_auto_input.js";

interface Types_props{
    submit_method:string;
    send_table_data:Function
}

// THE COMPONENT 
export default function Select_departments({submit_method, send_table_data}:Types_props) {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Select_departments`);

    const current_employee_id = useContext(Use_Context_current_table_item).show_context.current_table_item.id;

    const [departments, set_departments] = useState<Types_form_data[]>([]);
    const [input_data, set_input_data] = useState<Types_form_data>({});


    function handle_input_change({input, db_column}:Types_input_change){
        set_input_data({...input_data, [db_column]:input })
        

        send_table_data({
            table_name:"employee_departments",
            form_data:{
                input:input,
                db_column:db_column
            }
        })
    }


    // GET THE DEPARTMENT NAMES FOR NEW ENTRY
    async function fetch_department_names(){
        console.log(`%c IMPORTANT `, `background-color:${ log_colors.important }`,`fetch_department_names called`);
        try{
            const response = await axios.post("/get_columns",{
                table_name: "employee_departments",
            })
            const dep_names:Types_form_data[] = [];
            const form_data:Types_form_data = {};
            
            response.data.map((item:Types_column_info)=>{
                if(!item.column_name.includes("id")){
                    dep_names.push({
                        [item.column_name]: "0"
                })
                form_data[item.column_name] = "0";
                }
            })
            console.log(`%c FETCH DEPARTMENT NAMES DONE `, `background-color:${ log_colors.data }`);
            set_departments(dep_names);
            set_input_data(form_data);
            send_table_data({
                table_name:"employee_departments",
                form_data:[form_data]
            });

 
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };
    }

    
    // GET THE DEPARTMENT DATA FOR EXISTING ENTRY
    async function fetch_departments(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "employee_departments",
                filter_key: "employee_id",
                filter_item: current_employee_id
            })
            const form_data:Types_form_data = {};
            Object.keys(response.data[0]).map((column_name)=>{
                if(!column_name.includes("id")){
                form_data[column_name] = response.data[0][column_name];
                }
            })
            console.log(`%c FETCH DEPARTMENTS DONE `, `background-color:${ log_colors.data }`, "form_data", "\n", form_data);

            set_input_data(form_data);
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };
    }

    useEffect(() =>{
        fetch_department_names()
        if(submit_method === "edit"){
            fetch_departments()
        }
    },[])

    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for input_data`,'\n' ,input_data);
    // RETURNED VALUES 
    return(
        <form className="select_departments_form">
            <h3> Select Departments </h3>

            {  departments.map((item)=>{

                const key_name = Object.keys(item)[0];
                const item_val = input_data[key_name];
                
                return(
                    <label 
                        className="auto_form_input_label"
                        key={key_name}
                    >
                        <p>{key_name}:</p>   
                        <input

                            type="checkbox"
                            checked = {(item_val === "1") ? true : false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                                let value = "0"
                                    if(e.target.checked){
                                        value="1"
                                    } 
                                
                                handle_input_change({input:value, db_column:key_name})
                            }}              
                        >
                        
                        </input>
                    </label>
                )
            }
            )

            }

        </form>
    ); 
}