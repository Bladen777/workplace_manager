import { createContext, useContext, useState, ReactNode, useRef, useMemo } from "react"
// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../context/Context_departments_data.js";
import { Use_Process_input_data } from "../../_universal/Process_input_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";


// TYPE DEFINITIONS 
interface Types_context {
    update_func:{ 
        now:Function;
        wait:Function;
        update_context:Function;
    }; 
    show_context:Types_context_content; 
};

interface Types_context_content {   
    start_date: string | undefined;
    finish_date:string | undefined;
    departments:{
        [key:string]:{
            start_date:string | undefined;
            finish_date:string | undefined;
        }
    }
};

interface Types_context_function {   
    dep_id?:number;
    date_type: string;
    date: string | undefined;
};

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {
    start_date: undefined,
    finish_date: undefined,
    departments:{}

};

// CONTEXT TO USE 
export const Use_Context_project_dates = createContext<Types_context>({
    update_func:{
        now:()=>{},
        wait:()=>{}, 
        update_context:()=>{}
    },
    show_context:initial_context_content
});

// CONTEXT PROVIDER & UPDATE 
export function Provide_Context_project_dates({children}:{children:ReactNode}) {
    const [send_context, set_send_context] = useState<Types_context_content>(initial_context_content);
    const dates = useRef<Types_context_content>(initial_context_content);

    const departments = useContext(Use_Context_departments_data).show_context;
    const process_data = useContext(Use_Process_input_data);

    function setup_department_dates(){
            const department_dates:Types_context_content = {
                start_date:send_context.start_date,
                finish_date: send_context.finish_date,
                departments:{}
            }
    
            departments.forEach((department)=>{
                department_dates.departments[`dep_id_${department.department.id}`] = {
                    start_date: undefined,
                    finish_date: undefined
                };
            })
    
            dates.current = department_dates;
            set_send_context(department_dates)
            console.log(`   %c CONTEXT DATA `, `background-color:${ log_colors.data }`,`for department_dates`,'\n' ,department_dates);
        }

    // UPDATE THE CONTEXT 
    async function update_context({ dep_id, date_type, date  }:Types_context_function){

        let update_dates: Types_context_content = {
            ...dates.current!
        }
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_project_dates`, update_dates);

        function update_dep_dates({f_dep_id, dep_date_type, dep_date}:{f_dep_id:number, dep_date_type:string, dep_date:string | undefined}){
            const dep_name = `dep_id_${f_dep_id}`
            update_dates = {
                ...update_dates,
                departments:{
                    ...update_dates.departments,
                    [dep_name]:{
                        ...update_dates.departments[dep_name],
                        [dep_date_type]:dep_date
                    }
                }
            }
            process_data.handle_form_change({section_name:"projects", table_name: "project_department_budgets", entry_id:f_dep_id, form_data:{input:dep_date, db_column:dep_date_type}})
        }

        if(dep_id){
            update_dep_dates({f_dep_id: dep_id, dep_date_type: date_type, dep_date:date})
        }else {
            update_dates = {
                ...update_dates,
                [date_type]:date
            }
            process_data.handle_form_change({section_name:"projects", table_name: "projects", form_data:{input:date, db_column:date_type}})

        }


        const department_keys = Object.keys(update_dates.departments);

        department_keys.forEach((s_dep_name)=>{
            const current_dep = update_dates.departments[s_dep_name];
            const s_dep_id = Number(s_dep_name.slice(7));

            const start_date_time = (new Date(update_dates.start_date!)).getTime();
            const finish_date_time = (new Date(update_dates.finish_date!)).getTime();

            const dep_start_time = (new Date(current_dep.start_date!)).getTime();
            const dep_finish_time = (new Date(current_dep.finish_date!)).getTime();

            if(start_date_time > dep_start_time || (update_dates.start_date !== undefined && current_dep.start_date === undefined)){
                update_dep_dates({f_dep_id: s_dep_id, dep_date_type: "start_date", dep_date:update_dates.start_date})
            }

            if(finish_date_time < dep_finish_time || (update_dates.finish_date !== undefined && current_dep.finish_date === undefined)){
                console.log(`%c DATA `, `background-color:${ log_colors.data }`,'\n',`for finish_date_time`, finish_date_time, ` vs `, `dep_finish_time`, dep_finish_time, `update_dates`, update_dates);
                update_dep_dates({f_dep_id: s_dep_id, dep_date_type: "finish_date", dep_date:update_dates.finish_date})
            }

        })

        console.log(`   %c CONTEXT DATA `, `background-color:${ log_colors.important }`,`for update_dates`,'\n' ,update_dates);
        dates.current = update_dates;
        return(update_dates);
    }


// MEMOS AND EFFECTS

useMemo(() =>{
    if(departments[0].department.id !== 0){
        setup_department_dates()
    }
},[departments])

// RETURN THE CONTEXT PROVIDER 
    return (
        <Use_Context_project_dates.Provider value={{
           update_func:{
               now: async (props:Types_context_function)=>{set_send_context(await update_context(props))},
               wait: update_context,
               update_context: set_send_context 
           },
           show_context:send_context}}
        >
            {children} 
        </Use_Context_project_dates.Provider> 
    );
}