import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS 
import { Types_form_data } from "../../control_panel/context/Context_db_table_info.js";
import { Types_column_info } from "../../control_panel/context/Context_db_table_info.js";
import { Types_get_table_data } from "../../control_panel/context/Context_get_table_data.js";

interface Types_project_initial_data{
    db_column_info: Types_column_info[];
    initial_form_data: Types_form_data;
}

interface Types_context {
    update_func:{ 
        now:Function;
        wait:Function;
        update_context:Function;
    }; 
    show_context:Types_context_content; 
};

interface Types_context_content {   
    all_projects: Types_form_data[];
    current_project: Types_current_project;
    table_info:Types_project_initial_data;
};

interface Types_current_project {
    current_table_item:Types_form_data;
    submit_method:string;
}

interface Types_context_function {   
    current_project_id: number;
    submit_method:string
};

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {
    all_projects: [{}],
    current_project: {
        current_table_item:{},
        submit_method:""
    },
    table_info:{
        db_column_info:[{column_name: "", is_nullable: "", input_type: "" }], 
        initial_form_data:{[""]:""} 
    }
};

// CONTEXT TO USE 
export const Use_Context_project_data = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_project_data({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);

    // GET THE COLUMN NAMES
    async function fetch_project_table_info(){
        try{
            const response = await axios.post("/get_columns",{
                table_name: "projects"
            });
            const form_data: Types_form_data ={};
            const column_info: Types_column_info[] = response.data.map((item:Types_column_info, index:number) => {
                const item_name:string = item.column_name
    
                let initial_item_value: string | undefined = "";
                if(item_name.includes("date")){
                    item.input_type = "date"
                    initial_item_value = undefined;
                } else if (item_name.includes("budget")){
                    item.input_type = "text";
                    initial_item_value = "0.00"         
                } else {
                    item.input_type = "text"
                }; 
                
                
                form_data[item_name] = initial_item_value; 
                return(item);
            });

            const all_projects:Types_form_data[] = await fetch_projects();

            if(all_projects.length > 0){
                set_send_context({
                    all_projects: all_projects,
                    current_project: {
                        current_table_item: all_projects[all_projects.length - 1],
                        submit_method:"edit"
                    },
                    table_info:{
                        db_column_info: column_info,
                        initial_form_data: form_data
                    }
                });
            } else {
                set_send_context({
                    all_projects: send_context.all_projects,
                    current_project: {
                        current_table_item: form_data,
                        submit_method:"add"
                    },
                    table_info:{
                        db_column_info: column_info,
                        initial_form_data: form_data
                    }
                });

            }
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };
    } 



    // GET THE PROJECTES IN THE DATABASE
    async function fetch_projects({ sort_field, filter_key, filter_item, order_key, order_direction }:Types_get_table_data = {}){
        try {
            const response = await axios.post("/get_table_info",{
                table_name: "projects",
                filter_key: filter_key,
                filter_item: filter_item,
                sort_field: sort_field,
                order_key: order_key,
                order_direction: order_direction
            })
            const data = response.data;
            console.log(`   %c CONTEXT DATA `, `background-color:${ log_colors.data }`,`for Projects table data  `, '\n' , data);
            return(data);
        } catch (error) {
            console.log(`%cError getting Table info: `, 'background-color:darkred', error); 
        }
    }

    // UPDATE THE CONTEXT 
    async function update_context({current_project_id, submit_method }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_project_data`);

        current_project_id = 1;

        let update_data:Types_context_content;

        if(submit_method === "add"){
            update_data = {
                all_projects: send_context.all_projects,
                current_project: {
                    current_table_item: send_context.table_info.initial_form_data,
                    submit_method: submit_method
                },
                table_info: send_context.table_info
            };


        } else {
            update_data = {
                all_projects: await fetch_projects(),
                current_project: {
                    current_table_item: await fetch_projects({filter_key:"id", filter_item: current_project_id}),
                    submit_method: submit_method
                },
                table_info: send_context.table_info
            };
        }
        console.log(`%c CONTEXT_UPDATE_DATA `, `background-color:${ log_colors.context }`,`for update_data`,'\n' ,update_data);
        return update_data;
    }


// MEMOS AND EFFECTS

    useEffect(() =>{
        fetch_project_table_info();
      },[])

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_project_data.Provider value={{
           update_func:{
               now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
               wait: update_context,
               update_context: set_send_context 
           },
           show_context:send_context}}
        >
            {children} 
        </Use_Context_project_data.Provider> 
    );
}  