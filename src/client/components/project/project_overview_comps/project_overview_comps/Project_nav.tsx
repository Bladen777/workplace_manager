import { useContext, useMemo, useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Types_form_data, Use_Context_initial_data } from "../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../context/Context_active_entry.js";
import { Use_Context_user_info } from "../../../user_info/Context_user_info.js";

// HOOK IMPORTS 

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
    import "../../../../styles/project_overview/projects_nav.css"



// TYPE DEFINITIONS

// THE COMPONENT 
export default function Project_nav() {
    console.log(`%c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_nav`);

        const user_data = useContext(Use_Context_user_info).show_context;
        const initial_data = useContext(Use_Context_initial_data).show_context;
        const active_entry = useContext(Use_Context_active_entry).show_context;
        const [project_selection, set_project_selection] = useState<string>("user");
        const [all_projects, set_all_projects] = useState<Types_form_data[]>();
        const [user_projects, set_user_projects] = useState<Types_form_data[]>();

        const update_initial_data = useContext(Use_Context_initial_data).update_func;

        const project_data = initial_data["projects"].data[0];

        async function fetch_all_projects(){
            try {
                const response = await axios.post("/get_table_info",{
                    table_name: "projects",
                })
                return(response.data);
            } catch (error) {
                console.log(`%cError getting Table info: `, 'darkred', error);
                return([]) 
            }
        }

        async function fetch_user_projects(){

            let search_items = "";
            try {
                const employee_projects = await axios.post("/get_table_info",{
                    table_name: "employee_budgets",
                    sort_field: "project_id" ,
                    filter_key: "employee_id",
                    filter_item: user_data.id
                })

                console.log(`%c DATA `, `${ log_colors.data }`,`for employee_projects.data`,'\n' ,employee_projects.data);
                if(employee_projects.data.length === 0){
                    return
                }

                employee_projects.data.forEach((entry:{project_id:number}, index:number)=>{
                    if(index === 0){
                        search_items = `${entry.project_id}`
                    } else {
                        search_items += `AND id = ${entry.project_id}`
                    }
                });
                console.log(`%c DATA `, `${ log_colors.data }`,`for search_items`,'\n' ,search_items);
                
            } catch (error) {
                console.log(`%cError getting Table info: `, 'darkred', error);
                return([]) 
            }

            try {
                const response = await axios.post("/get_table_info",{
                    table_name: "projects",
                    filter_key: "id",
                    filter_item: search_items
                })

                set_project_selection("user");
                return (response.data);
            } catch (error) {
                console.log(`%cError getting Table info: `, 'darkred', error);
                return([]) 
            }
        }
                

        console.log(`%c DATA `, `${ log_colors.data }`,`for all_projects`,'\n' ,all_projects);
// MEMOS AND EFFECTS

    useMemo(() =>{
        (async () => {
            if(user_data.is_admin){
                const update_all_projects = await fetch_all_projects();
                set_all_projects(update_all_projects)
            }
            const update_user_projects = await fetch_user_projects();
            set_user_projects(update_user_projects)
        })()
    },[initial_data])

// RETURNED VALUES 
    return(
        <div className="project_nav">
            <div className="project_selection">
                {user_data.is_admin && 
                    <button 
                        className="project_selection_switch general_btn"
                        onClick={()=>{set_project_selection(project_selection === "user" ? "all" : "user")}}
                    >
                        {project_selection === "user" ? "All Projects" : "My Projects"}

                    </button>
                }
                
                <h3>{project_data.project_name}</h3>
            </div>
            

            <button
                id="project_nav_left"
                className="project_nav_btn"
            >
                🠸
            </button>
            <button
                id="project_nav_right"
                className="project_nav_btn"
            >
                🠺
            </button>
        </div>
    ); 
}