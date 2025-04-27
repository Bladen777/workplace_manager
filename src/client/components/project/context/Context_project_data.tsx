import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react"
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
interface Types_table_info{
    projects:Types_project_initial_data;
    project_department_budgets:Types_project_initial_data;
    employee_budgets:Types_project_initial_data;
    [key:string]:Types_project_initial_data;
}

interface Types_project_budgets {
    project_department_budgets: Types_form_data[];
    employee_budgets:Types_form_data[];
}

interface Types_current_project extends Types_project_budgets{
    project_data:Types_form_data;
}

interface Types_context_content {   
    all_projects: Types_form_data[];
    current_project: Types_current_project;
    table_info:Types_table_info;
    submit_method:string;
};

interface Types_context {
    update_func:{ 
        now:Function;
        wait:Function;
        update_context:Function;
    }; 
    show_context:Types_context_content; 
};

interface Types_context_function {   
    current_project_id?: number;
    submit_method:string;
};

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {
    all_projects: [{}],
    current_project: {
        project_data:{},
        project_department_budgets:[{}],
        employee_budgets:[{}],
    },
    table_info:{
        projects:{
            db_column_info:[{column_name: "", is_nullable: "", input_type: "" }], 
            initial_form_data:{[""]:""} 
        },
        project_department_budgets:{
            db_column_info:[{column_name: "", is_nullable: "", input_type: "" }], 
            initial_form_data:{[""]:""} 
        },
        employee_budgets:{
            db_column_info:[{column_name: "", is_nullable: "", input_type: "" }], 
            initial_form_data:{[""]:""} 
        },    
    },
    submit_method:"edit"
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

    // GET THE INITIAL TABLE DATA
    async function fetch_initial_data({table_name}:{table_name:string}){
        const form_data: Types_form_data = {};
        const column_info:Types_column_info[] = []
        try{
            const response = await axios.post("/get_columns",{
                table_name: table_name
            });
            response.data.forEach((item:Types_column_info, index:number) => {
                const item_name:string = item.column_name
    
                let initial_item_value: string | undefined = "";
                if(item_name.includes("date")){
                    item.input_type = "date"
                    initial_item_value = undefined;
                } else if (item_name.includes("hours") ){   
                    item.input_type = "text";
                    initial_item_value = "0"              
                } else if (item_name.includes("budget")){
                    item.input_type = "text";
                    initial_item_value = "0.00"         
                } else {
                    item.input_type = "text"
                }; 
                
                form_data[item_name] = initial_item_value; 
                column_info.push(item)
            });

        } catch (error){
            console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };
        return {
            db_column_info: column_info,
            initial_form_data: form_data
        }
    }
    
    // GET THE PROJECTES IN THE DATABASE
    async function fetch_projects({ filter_key, filter_item }:Types_get_table_data = {}){
        try {
            const response = await axios.post("/get_table_info",{
                table_name: "projects",
                filter_key: filter_key,
                filter_item: filter_item,
            });
            const data = response.data;
            console.log(`   %c CONTEXT DATA `, `background-color:${ log_colors.data }`,`for Projects table data  `, '\n' , data);
            if(filter_key){
                return(data[0])
            }else {
                return(data);
            }
        } catch (error) {
            console.log(`%cError getting Table info: `, 'background-color:darkred', error); 
        }
    }

    //  GET THE OTHER DEPARTMENT & EMPLOYEE BUDGET DATA
    async function fetch_budgets({ filter_item }:Types_get_table_data = {}){
        const fetched_data:Types_project_budgets = {
            project_department_budgets: [],
            employee_budgets:[]
        }

        try{
            const response = await axios.post("/get_table_info",{
                table_name: "project_department_budgets",
                filter_key: "project_id",
                filter_item: filter_item,
            });

            fetched_data.project_department_budgets = response.data;
        
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };

        try{
            const response = await axios.post("/get_table_info",{
                table_name: "employee_budgets",
                filter_key: "project_id",
                filter_item: filter_item,
            });
            fetched_data.employee_budgets = response.data;
        
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };
    
        return fetched_data;
    }


    // UPDATE THE CONTEXT 
    async function update_context({current_project_id, submit_method }:Types_context_function){
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_project_data`);
        let update_data:Types_context_content = {...send_context}

        if(current_project_id && send_context.current_project.project_data.id !== current_project_id){
            const project_data = await fetch_projects({filter_key:"id", filter_item:current_project_id});
            const budget_data = await fetch_budgets({filter_item:current_project_id});
            
            update_data = {
                ...update_data,
                current_project:{
                    project_data: project_data,
                    project_department_budgets:budget_data.project_department_budgets,
                    employee_budgets:budget_data.employee_budgets,
                }
            }

        }
        update_data ={
            ...update_data,
            submit_method:submit_method
        }

        console.log(`%c CONTEXT_UPDATE_DATA `, `background-color:${ log_colors.context }`,`for update_data`,'\n' ,update_data);
        return update_data;
    }


// MEMOS AND EFFECTS
    useMemo(() =>{
        (async () => {
            const all_projects:Types_form_data[] = await fetch_projects();
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for all_projects`,'\n' ,all_projects);
            let update_data = {...send_context};
            let blah = 0;
            if(blah > 0){
                const latest_project_id = all_projects[all_projects.length -1].id;
                const project_data = await fetch_projects({filter_key:"id", filter_item:latest_project_id});
                const budget_data = await fetch_budgets({filter_item:latest_project_id});

                update_data = {
                    ...update_data,
                    current_project:{
                        project_data: project_data,
                        project_department_budgets:budget_data.project_department_budgets,
                        employee_budgets:budget_data.employee_budgets,
                    },
                }

            }

            const table_info:Types_table_info = {
                projects: await fetch_initial_data({table_name:"projects"}),
                project_department_budgets: await fetch_initial_data({table_name:"project_department_budgets"}),
                employee_budgets: await fetch_initial_data({table_name:"employee_budgets"})
            }

            update_data = {
                ...update_data,
                all_projects: all_projects,
                table_info: table_info
            }

            console.log(`   %c CONTEXT DATA `, `background-color:${ log_colors.data }`,`for update_data`,'\n' ,update_data);
            set_send_context(update_data)

        })()
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