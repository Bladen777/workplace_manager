import { useContext, useRef } from "react";
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_table_data } from "../control_panel/context/Context_get_table_data.js";
import { Use_Context_table_info } from "../control_panel/context/Context_db_table_info.js";
import { Use_Context_current_table_item } from "../control_panel/context/Context_current_table_item.js";
import { Use_Context_departments_data } from "../context/Context_departments_data.js";
import { Use_Context_project } from "../project/context/Context_projects.js";


// HOOK IMPORTS 

// STYLE IMPORTS

// LOG STYLE 
import { log_colors } from "../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../control_panel/context/Context_db_table_info.js";
import { Types_input_change } from "./inputs/Form_auto_input.js";
import { Types_column_info } from "../control_panel/context/Context_db_table_info.js";

interface Types_table_form_data {
    [key:string]:Types_form_data[];
}

interface Types_post_form {
    submit_method: string;
}

export interface Types_data_change {
    table_name?: string;
    form_data: Types_input_change | Types_form_data[];
}

// THE COMPONENT 
export default function Process_input_data() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.important }`, `Edit_data`);
    const section_name = useContext(Use_Context_table_info).show_context.table_name;

    const project_db_column_info = useContext(Use_Context_project).show_context.table_info.db_column_info;
    const current_db_column_info = useContext(Use_Context_table_info).show_context.db_column_info;


    // CONTEXT UPDATERS
    const update_table_data = useContext(Use_Context_table_data).update_func;
    const update_departments_data = useContext(Use_Context_departments_data).update_func;

    const current_table_item = useContext(Use_Context_current_table_item).show_context.current_table_item;
    const current_project = useContext(Use_Context_project).show_context.current_project;

    const table_data_ref = useRef<Types_table_form_data>({});

    // ENSURE THE NEW TABLE DATA IS IN A ARRAY FORMAT
    function handle_form_change({table_name, form_data}:Types_data_change){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data, Array.isArray(form_data) ? "is Array" : "is not Array");
        let form_data_array: Types_form_data[] = []; 

        if(table_name === null || table_name === undefined){
            table_name = section_name;
        }

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for table_name`,'\n' ,table_name);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for table_data_ref.current`,'\n' ,table_data_ref.current);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for table_data_ref.current[table_name]`,'\n' ,table_data_ref.current[table_name]);
        

        if(!Array.isArray(form_data)){
            const update_form_data = {...table_data_ref.current[table_name][0], [form_data.db_column]:form_data.input};
            form_data_array.push(update_form_data);
            table_data_ref.current[table_name] = form_data_array;
        } else {
            table_data_ref.current[table_name] = form_data;
        }
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for table_data_ref.current`,'\n' ,table_data_ref.current);
    }

    // CHECK TO ENSURE REQUIRED FIELDS ARE NOT LEFT EMPTY BEFORE SUBMITTING
    function check_empty_input(table_name:string){
        const missing_inputs:string[] = [];
        const db_column_info = project_db_column_info ? project_db_column_info : current_db_column_info;
        table_data_ref.current[table_name].map((current_entry:Types_form_data)=>{
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

        console.log(`   %c DATA `, `background-color:${ log_colors.data }`,`for missing_input_strings`,'\n' ,missing_input_strings);
        return missing_input_strings;
    }

    // SEND THE INFOMATION TO THE DATABASE TO BE ADDED/EDITED
    async function post_form({submit_method}:Types_post_form){
        console.log(`%c THE DATA BEING SENT `, `background-color:${ log_colors.important }`,`for table_data_ref.current`,'\n' ,table_data_ref.current);

        const missing_input = check_empty_input(section_name);

        if(missing_input !== ""){
            return (`Please enter values for ${missing_input}`)
        }


        if(section_name === "departments" && submit_method !== "edit"){
            let dep_name:string | number = ""; 
            table_data_ref.current.departments.forEach((item)=>{
                if(!item.id){
                    dep_name = item.department_name!;
                }
            });
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for dep_name`,'\n' ,dep_name);
            await edit_employee_deps_cols(dep_name,submit_method)
        }


        

        let status_message:string = "";
        for await(let table_name of Object.keys(table_data_ref.current)){
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for table_name`,'\n' ,table_name);

            let filter_key = "id";
            let filter_item = current_table_item.id;
            const db_column_names = Object.keys(table_data_ref.current[table_name][0])

            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for db_column_names`,'\n' ,db_column_names);
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for filter_item`,'\n' ,filter_item);


            if(table_name === "employee_departments"){
                filter_key = "employee_id"
            } else if (table_name === "departments"){
                await update_departments_data.now({});
            } else if (table_name === "projects"){
                filter_item = current_project.id 
            }

    
            try {
                const response = await axios.post("/edit_form_data",{
                    table_name: table_name,
                    filter_key: filter_key,
                    filter_item: filter_item,
                    submit_method: submit_method,
                    db_column_info: db_column_names, 
                    submit_data: table_data_ref.current[table_name]
                })
       
                if(table_name === section_name){
                    const table_data_update = await update_table_data.wait({section_name:table_name});
                    update_table_data.update_context(table_data_update);
                }
       
                console.log("The success_message: ",response.data);
                status_message = (`${response.data}`);

            } catch (error) {
                console.log('%cError posting info to database: ', 'background-color:darkred',error);
                status_message =("Failed to submit data"); 
            }

        }

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for blah`,'\n' , status_message);
        return status_message;
    }


    // ADJUST THE COLUMNS IN THE EMPLOYEE_DEPARTMENTS DATABASE
    async function edit_employee_deps_cols(dep_name:string , submit_method:string){
        console.log(`%c important `, `background-color:${ log_colors.important }`,`for edit_employee_deps_cols called`);
        try{
            const response = await axios.post("edit_employee_deps_cols",{
                dep_name: dep_name,
                submit_method: submit_method 

            }) 
        } catch (error){
            
            console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };
    }


    // RETURNED VALUES 
    return({
        handle_form_change: ({table_name, form_data}:Types_data_change) => handle_form_change({table_name, form_data}),
        post_form: async ({submit_method}:Types_post_form) => await post_form({submit_method})
    }); 
}