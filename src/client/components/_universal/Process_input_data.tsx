import { createContext, useContext, useState, ReactNode, useRef } from "react"
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../context/Context_initial_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../styles/_log_colors.js";



// TYPE DEFINITIONS 
import { Types_input_change } from "./inputs/Form_auto_input.js";
import { Types_form_data } from "../context/Context_initial_data.js";
import { Types_column_info } from "../context/Context_initial_data.js";


interface Types_context{
    update_data: Function;
    clear_form: Function;
    post_data: Function;
    delete_entry: Function;
}

interface Types_data_info {
    table_name: string;
    entry_id: number;
}

export interface Types_data_change{
    form_data: Types_form_data[] | Types_input_change;
}

export interface Types_update_data extends Types_data_change{
    table_name: string;
    entry_id?: number;
    entry_id_key?: string;
}

interface Types_data {
    [key:string]: Types_form_data[];
}

interface Types_post_data {
    display_entry_id?: number;
    submit_method: string;
}

export interface Types_post_response{
    message:string;
    entry_id?:number;
}

// CONTEXT TO USE 
export const Use_Process_input_data = createContext<Types_context>({
    update_data: ()=>{},
    clear_form:()=>{},
    delete_entry: ()=>{},
    post_data: ()=>{}
});


// CONTEXT PROVIDER & UPDATE 
export function Provide_Process_input_data({children}:{children:ReactNode}) {
   
    const data_info = useContext(Use_Context_initial_data).show_context;
    const data_ref = useRef<Types_data>({});
    const target_entry_id_ref = useRef<number>()

    function clear_form(){
        data_ref.current = ({})
    }

    function update_data({table_name, entry_id, entry_id_key, form_data}:Types_update_data){

        let update_data = {...data_ref.current}
        console.log(`%c EXISTING DATA `, `${ log_colors.process_data }`,`for update_data`,'\n' ,{...update_data});
        console.log(`%c SENT DATA `, `${ log_colors.process_data }`,`for form_data`,'\n' ,form_data);
        if(Array.isArray(form_data)){
            update_data[table_name] = form_data;
        } else if(entry_id_key){
            const entry_index = update_data[table_name].findIndex((entry)=>{
                if(entry[entry_id_key!] === entry_id){
                    return entry   
                }
            })
            update_data[table_name][entry_index][form_data.db_column] = form_data.input;
        } else {
            update_data[table_name] = {
                ...update_data[table_name],
                [form_data.db_column]:form_data.input
            }
        }

        data_ref.current = update_data;
        console.log(`%c UPDATE_DATA `, `${ log_colors.process_data }`,`for update_data`,'\n' ,update_data);
    }

    async function delete_entry({table_name, entry_id}:Types_data_info){

        let status_message:string = "failed to delete_data";

        try{
            const response = await axios.post("/edit_form_data",{
                table_name: table_name,
                filter_key: "id",
                filter_item: entry_id,
                submit_method: "delete"
            }) 
            status_message = response.data.message;
        } catch (error){
          console.log(`%c delete_entry has the following error: `, 'background-color:darkred', error); 
        };

        if(table_name === "departments"){ 
            handle_departments_change({submit_method:"delete", entry_id:entry_id})
        }

        return status_message
    }

    function check_empty_input({table_names}:{table_names:string[]}){
        let missing_message:string = ""

        table_names.forEach((table_name, index)=>{
            const missing_inputs:string[] = [];
            const db_column_info:Types_column_info[] = data_info[table_name].info.db_column_info

            if(Array.isArray(data_ref.current[table_name])){
                data_ref.current[table_name].map((current_entry:Types_form_data)=>{
                    check_columns({current_entry:current_entry});
                })
            } else {
                check_columns({current_entry:data_ref.current[table_name]})
            }

            function check_columns({current_entry}:{current_entry:Types_form_data}){
                db_column_info.map((item: Types_column_info) => {
                    const null_check = item.is_nullable;
                    const current_item = item.column_name;
                    if(null_check === "NO" && current_entry[current_item] === "" ){
                        missing_inputs.push(current_item);
                    }
                }) 
            }
    
            let missing_input_strings ="";
    
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
    
            if(missing_input_strings !== ""){
                if(index === 0){
                    missing_message += (`${missing_input_strings}`)
                } else {
                    missing_message += (`, ${missing_input_strings}`)
                };
            };  
        })

        return missing_message;
    }

    function re_arrange_tables(){
        let table_names:string[] = Object.keys(data_ref.current);

        if(table_names.includes("employees")){
            change_order({name:"employees"})
        } else if (table_names.includes("projects")){
            change_order({name:"projects"})
        }

        function change_order({name}:{name:string}){
            const index = table_names.indexOf(name);
            table_names.slice(index,1);
            table_names.unshift(name);
        }

        return table_names;
    }

    async function post_data({submit_method, display_entry_id}:Types_post_data):Promise<Types_post_response>{
        let status_message:string = "";
        if(display_entry_id && display_entry_id !== 0){
            target_entry_id_ref.current = display_entry_id;
        }

        const table_names:string[] = re_arrange_tables();

        const missing_inputs = check_empty_input({table_names:table_names});
        if(missing_inputs !== ""){
            status_message = `Please enter values for ${missing_inputs}`
            return {message: status_message}
        }

        let table_name:string;
        
        for await(table_name of table_names){

            const db_column_names = data_info[table_name].info.db_column_info.map((entry)=>entry.column_name);
            let filter_key = "";
            let filter_item: string | number | undefined = "";

            if(submit_method === "edit" && !Array.isArray(data_ref.current[table_name])){
                filter_key = "id";
                filter_item = data_ref.current[table_name][0].id;
            }

            console.log(`%c DATA SENT TO BACKEND `, `${ log_colors.important }`,`for data_ref.current[table_name]`,'\n' ,data_ref.current[table_name]);
            try {
                const response = await axios.post("/edit_form_data",{
                    table_name: table_name,
                    filter_key: filter_key,
                    filter_item: filter_item,
                    submit_method: submit_method,
                    db_column_info: db_column_names, 
                    submit_data: data_ref.current[table_name]
                })
        
                console.log("The success_message: ",response.data);
                status_message = (`${response.data.message}`);

                if(table_name === "projects"){
                    target_entry_id_ref.current = response.data.entry_id;
                } else if (table_name === "employees"){
                    target_entry_id_ref.current = response.data.entry_id;
                } else if( !table_names.includes("projects") && !table_names.includes("employees")){
                    target_entry_id_ref.current = response.data.entry_id;
                }
            } catch (error) {
                console.log('%cError posting info to database: ', 'darkred',error);
                status_message =("Failed to submit data");
            }  

        }

        return {
            message: status_message,
            entry_id: target_entry_id_ref.current
        }
    }

    
    async function handle_departments_change({submit_method, entry_id}:{submit_method:string, entry_id:number}){
        if(submit_method !== "edit"){
            try{
                const response = await axios.post("edit_deps_cols",{
                    dep_id: entry_id,
                    submit_method: submit_method 
                }) 
            } catch (error){
                console.log(`%c edit_deps_cols has the following error: `, 'darkred', error); 

            };  
        } 
    }


// MEMOS AND EFFECTS

// RETURN THE CONTEXT PROVIDER 
    return(
        <Use_Process_input_data.Provider value={{
            update_data: update_data,
            clear_form: clear_form,
            delete_entry: delete_entry,
            post_data: post_data,
        }}

        > 
        {children} 
        </Use_Process_input_data.Provider> 
    ) 
}