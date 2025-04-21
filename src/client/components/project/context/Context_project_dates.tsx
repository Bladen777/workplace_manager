import { createContext, useContext, useState, ReactNode, useRef, useMemo } from "react"
// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../context/Context_departments_data.js";

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
    start_date: string;
    finish_date:string;
    departments:{
        [key:string]:{
            start_date:string;
            finish_date:string;
        }
    }
};

interface Types_context_function {   
    dep_id_name?:string;
    date_type: string;
    date: string;
};

// INITIAL CONTEXT CONTENT 
const initial_context_content:Types_context_content = {
    start_date:"",
    finish_date:"",
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

    function setup_department_dates(){
            const department_dates:Types_context_content = {
                start_date:send_context.start_date,
                finish_date: send_context.finish_date,
                departments:{}
            }
    
            departments.forEach((department)=>{
                department_dates.departments[`dep_id_${department.department.id}`] = {
                    start_date:"",
                    finish_date:""
                };
            })
    
            dates.current = department_dates;
            set_send_context(department_dates)
            console.log(`   %c CONTEXT DATA `, `background-color:${ log_colors.data }`,`for department_dates`,'\n' ,department_dates);
        }

    // UPDATE THE CONTEXT 
    async function update_context({ dep_id_name, date_type, date  }:Types_context_function){

        let update_dates: Types_context_content = {
            ...dates.current!
        }
        console.log(`%c CONTEXT UPDATE `, `background-color:${ log_colors.context }`, `for Context_project_dates`, update_dates);

        function update_dep_dates({dep_name, dep_date_type, dep_date}:{dep_name:string, dep_date_type:string, dep_date:string}){
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
        }


        if(dep_id_name){
            update_dep_dates({dep_name: dep_id_name, dep_date_type: date_type, dep_date:date})
        }else {
            update_dates = {
                ...update_dates,
                [date_type]:date
            }
        }


        const department_keys = Object.keys(update_dates.departments);

        department_keys.forEach((s_dep_name)=>{
            const current_dep = update_dates.departments[s_dep_name];

            const start_date_time = (new Date(update_dates.start_date)).getTime();
            const finish_date_time = (new Date(update_dates.finish_date)).getTime();

            const dep_start_time = (new Date(current_dep.start_date)).getTime();
            const dep_finish_time = (new Date(current_dep.finish_date)).getTime();

            if(start_date_time > dep_start_time || (update_dates.start_date !== "" && current_dep.start_date === "")){
                update_dep_dates({dep_name: s_dep_name, dep_date_type: "start_date", dep_date:update_dates.start_date})
            }

            if(finish_date_time < dep_finish_time || (update_dates.start_date !== "" && current_dep.start_date === "")){
                update_dep_dates({dep_name: s_dep_name, dep_date_type: "finish_date", dep_date:update_dates.finish_date})
            }

        })
        for(let dep_ind = 0; dep_ind < department_keys.length -1; dep_ind++){
            

        }



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