import { createContext, ReactNode, useContext, useRef } from "react";
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Types_get_table_data, Use_Context_table_data } from "../control_panel/context/Context_get_table_data.js";
import { Use_Context_table_info } from "../control_panel/context/Context_db_table_info.js";
import { Use_Context_current_table_item } from "../control_panel/context/Context_current_table_item.js";
import { Use_Context_departments_data } from "../context/Context_departments_data.js";
import { Use_Context_project_data } from "../project/context/Context_project_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../control_panel/context/Context_db_table_info.js";
import { Types_input_change } from "./inputs/Form_auto_input.js";
import { Types_column_info } from "../control_panel/context/Context_db_table_info.js";


interface Types_context{
    handle_form_change: Function;
    clear_form:Function;
    post_form:Function;
    delete_entry:Function;
}

interface Types_table_form_data {
    [key:string]:{
        [key:string]:Types_form_data[];
    }
}

interface Types_post_form {
    section_name: string;
    submit_method: string;
}

interface Types_delete_entry{
    table_name:string;
    item_id:number;
}

export interface Types_data_change {
    table_name?: string;
    form_data: Types_input_change | Types_form_data[];
}

interface Types_data_process extends Types_data_change{
    section_name: string;
}


// CONTEXT TO USE 
export const Use_Process_input_data = createContext<Types_context>({
    handle_form_change: ()=>{},
    clear_form:()=>{},
    post_form: ()=>{},
    delete_entry: ()=>{}
});


// CONTEXT PROVIDER & UPDATE 
export function Provide_Process_input_data({children}:{children:ReactNode}) {

    const active_table = useContext(Use_Context_table_info).show_context.table_name;

    const project_db_column_info = useContext(Use_Context_project_data).show_context.table_info.db_column_info;
    const current_db_column_info = useContext(Use_Context_table_info).show_context.db_column_info;

    const current_table_item = useContext(Use_Context_current_table_item).show_context.current_table_item;
    const current_project = useContext(Use_Context_project_data).show_context.current_project;
    const departments = useContext(Use_Context_departments_data).show_context;

    const current_item_id = useRef<number>();
    current_item_id.current = current_table_item.id;

    // CONTEXT UPDATERS
    const update_table_data = useContext(Use_Context_table_data).update_func;
    const update_departments_data = useContext(Use_Context_departments_data).update_func;

    const table_data_ref = useRef<Types_table_form_data>({
        control_panel:{},
        projects:{}
    });
    console.log(`%c PROCESS_INPUT_DATA `, `background-color:${ log_colors.process_data }`, `for`,table_data_ref.current);

    // ENSURE THE NEW TABLE DATA IS IN A ARRAY FORMAT
    function handle_form_change({section_name, table_name, form_data}:Types_data_process){

        if(table_name === null || table_name === undefined){
            table_name = active_table;
        }

        console.log(`%c PROCESS_INPUT_DATA CURRENT_DATA`, `background-color:${ log_colors.process_data }`, `for`,table_data_ref.current);
        console.log(`%c PROCESS_INPUT_DATA FORM_DATA `, `background-color:${ log_colors.process_data }`,`for ${section_name} form_data for ${table_name}`,'\n' ,form_data, Array.isArray(form_data) ? "is Array" : "is not Array");
        
        let new_form_data = {...table_data_ref.current[section_name]};



        console.log(`%c PROCESS_INPUT_DATA CURRENT_DATA`, `background-color:${ log_colors.process_data }`, `for`, new_form_data);

        


        if(!Array.isArray(form_data)){
            new_form_data = {
                ...new_form_data,
                    [table_name]:[{
                        ...new_form_data[table_name][0],
                        [form_data.db_column]:form_data.input
                    }
                ]
            }
        
        } else {
            new_form_data = {
                ...new_form_data,
                    [table_name]:form_data
            }
        }
        table_data_ref.current[section_name] = new_form_data;
        console.log(`%c PROCESS_INPUT_DATA CURRENT_DATA`, `background-color:${ log_colors.process_data }`, `for`,table_data_ref.current);

    }

    // CHECK TO ENSURE REQUIRED FIELDS ARE NOT LEFT EMPTY BEFORE SUBMITTING
    function check_empty_input({section_name, table_name}:{section_name:string, table_name:string}){
        const missing_inputs:string[] = [];
        const db_column_info = project_db_column_info ? project_db_column_info : current_db_column_info;
        table_data_ref.current[section_name][table_name].map((current_entry:Types_form_data)=>{
            db_column_info.map((item: Types_column_info) => {
                const null_check = item.is_nullable;
                const current_item = item.column_name;
                if(null_check === "NO" && current_entry[current_item] === "" ){
                    missing_inputs.push(current_item);
                }
            }) 
        })

        let missing_input_strings =""

        missing_inputs.map((item:string, index:number) => {
            const item_string = item.replace("_"," ");
            if(missing_input_strings === ""){
                missing_input_strings += item_string;
            } else if(index === missing_inputs.length - 1){
                missing_input_strings += " & " + item_string;
            }else {
                missing_input_strings += ", " + item_string ;
            }   
        })

        return missing_input_strings;
    }

    function clear_form(section_name:string){
        const keep_data = (
            section_name !== "control_panel"
            ? "control_panel"
            : "projects"
        )
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for keep_data`,'\n' ,keep_data);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for section_name`,'\n' ,section_name);

        table_data_ref.current = {
            [section_name]:{},
            [keep_data]:table_data_ref.current[keep_data]    
        };

        console.log(`%c PROCESS_INPUT_DATA DATA CLEARED`, `background-color:${ log_colors.process_data }`, `for`,table_data_ref.current);
        return true
    }

    // SEND THE INFOMATION TO THE DATABASE TO BE ADDED/EDITED
    async function post_form({section_name, submit_method}:Types_post_form){
        console.log(`%c THE DATA BEING SENT `, `background-color:${ log_colors.important }`,`for table_data_ref.current`,'\n' ,table_data_ref.current);

        const section_tables = Object.keys(table_data_ref.current[section_name]);
        let missing_inputs = "";

        section_tables.forEach((table_name)=>{
            const missing_input = check_empty_input({section_name: section_name, table_name:table_name});
            if(missing_input !== ""){
                missing_inputs += (`${missing_input}, `)
            }
        })

        if(missing_inputs !== ""){
            console.log(`   %c DATA `, `background-color:${ log_colors.data }`,`for missing_input_strings`,'\n' ,missing_inputs);
            return (`Please enter values for ${missing_inputs}`)
        }
        
        if(active_table === "employees"){
            const adjust_table_data_ref = {
                employees: table_data_ref.current[section_name].employees,
                employee_departments: table_data_ref.current[section_name].employee_departments
            }
            table_data_ref.current[section_name] = adjust_table_data_ref;
            const employee_data = table_data_ref.current[section_name]["employees"][0];
            if(employee_data.name === ""){
                const update_form_data = {...table_data_ref.current[section_name]["employees"][0], name:employee_data.email};
                table_data_ref.current[section_name]["employees"] = [update_form_data];
            }
        }

        let status_message:string = "";
        for await(let table_name of Object.keys(table_data_ref.current[section_name])){
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for `,table_name);

            let filter_key = "id";
            let filter_item = current_item_id.current;
            const db_column_names = Object.keys(table_data_ref.current[section_name][table_name][0])

            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for db_column_names`,'\n' ,db_column_names);
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for filter_item`,'\n' ,filter_item);


            if(table_name === "employee_departments"){
                filter_key = "employee_id"
                if(submit_method === "add"){
                    const update_form_data = {...table_data_ref.current[section_name]["employee_departments"][0], employee_id:current_item_id.current};
                    table_data_ref.current[section_name]["employee_departments"] = [update_form_data];
                    db_column_names.push(filter_key);
                }
            } else if (table_name === "departments"){
                await update_departments_data.now({});
            } else if (table_name === "projects"){
                filter_item = current_project.current_table_item.id 
            }
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for table_data_ref.current[section_name]`,'\n' ,table_data_ref.current[section_name]);


            try {
                const response = await axios.post("/edit_form_data",{
                    table_name: table_name,
                    filter_key: filter_key,
                    filter_item: filter_item,
                    submit_method: submit_method,
                    db_column_info: db_column_names, 
                    submit_data: table_data_ref.current[section_name][table_name]
                })
       
                if(table_name === active_table){
                    const table_data_update = await update_table_data.wait({active_table:table_name});
                    update_table_data.update_context(table_data_update);
                }
       
                console.log("The success_message: ",response.data);
                status_message = (`${response.data.message}`);
                if(submit_method === "add"){
                    current_item_id.current = response.data.item_id;
                    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for current_item_id.current`,'\n' ,current_item_id.current);
                }
            } catch (error) {
                console.log('%cError posting info to database: ', 'background-color:darkred',error);
                status_message =("Failed to submit data"); 
            }
        }


        if(active_table === "departments" && submit_method == "add"){
            try{
                const response = await axios.post("edit_deps_cols",{
                    dep_id: current_item_id.current!,
                    submit_method: submit_method 
                }) 
                console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for response`,'\n' ,response);
            } catch (error){
                console.log(`%c  has the following error: `, 'background-color:darkred', error); 
            };  
        }

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for status_message`,'\n' , status_message);
        return status_message;
    }

    async function delete_entry({table_name, item_id}:Types_delete_entry){

        let status_message:string = "";
        try {
            const response = await axios.post("/edit_form_data",{
                table_name: table_name,
                filter_key: "id",
                filter_item: item_id,
                submit_method: "delete"
            })
   
            if(table_name === active_table){
                const table_data_update = await update_table_data.wait({active_table:table_name});
                update_table_data.update_context(table_data_update);
            }
   
            console.log("The success_message: ",response.data);
            status_message = (`${response.data.message}`);
        } catch (error) {
            console.log('%cError posting info to database: ', 'background-color:darkred',error);
            status_message =("Failed to delete data"); 
        }

        if(active_table === "departments"){
            try{
                const response = await axios.post("edit_deps_cols",{
                    dep_id: item_id,
                    submit_method: "delete" 
                }) 
            } catch (error){
                console.log(`%c  has the following error: `, 'background-color:darkred', error); 
            };  
        }
        return status_message;
    }
// MEMOS AND EFFECTS 

// RETURNED VALUES
    return(
        <Use_Process_input_data.Provider value={{
            handle_form_change: ({section_name, table_name, form_data}:Types_data_process) => handle_form_change({section_name, table_name, form_data}),
            clear_form:(section_name:string)=>clear_form(section_name),
            post_form: async ({section_name, submit_method}:Types_post_form) => await post_form({section_name, submit_method}),
            delete_entry: ({table_name, item_id}:Types_delete_entry)=> delete_entry({table_name, item_id})
        }}

        > 
        {children} 
        </Use_Process_input_data.Provider> 
    ) 

}

