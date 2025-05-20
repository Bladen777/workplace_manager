import { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../../../styles/_log_colors.js";
    import "../../../../../styles/project_overview/projects_nav.css";

// CONTEXT IMPORTS 
import { Use_Context_initial_data } from "../../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../../context/Context_active_entry.js";
import { Use_Context_user_info } from "../../../../user_info/Context_user_info.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 
import Animate_flip_switch from "../../../../_universal/animations/Animate_flip_switch.js";
import Project_search from "./Project_search.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../../../context/Context_initial_data.js";

// THE COMPONENT 
export default function Project_nav() {
    console.log(`%c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_nav`);

        const user_data = useContext(Use_Context_user_info).show_context;
        const initial_data = useContext(Use_Context_initial_data).show_context;
        const active_entry = useContext(Use_Context_active_entry).show_context;
        
        const [all_projects, set_all_projects] = useState<Types_form_data[]>([]);
        const [selected_projects, set_selected_projects] = useState<Types_form_data[]>([]);
        const [selected_index, set_selected_index] = useState<number>(0)

        const update_initial_data = useContext(Use_Context_initial_data).update_func;
        const update_active_entry = useContext(Use_Context_active_entry).update_func;

        // SWTICHES
        const [project_selection, set_project_selection] = useState<string>("user");
        const [ps_open, set_ps_open] = useState<boolean>(false); 

        // CONSTS FOR ANIMATING
        const animate_fs = Animate_flip_switch();
        const animate_fs_btn_ref = useRef<HTMLDivElement | null>(null);
        const animate_fs_box_ref = useRef<HTMLDivElement | null>(null);

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
                    table_name: "project_employees",
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

        function handle_ps_click(){
            set_ps_open(!ps_open)
            animate_fs.run_animation({animate_forwards:!ps_open})
        }

        async function change_project(direction:string){
            
            let move:number = 1;
            if(direction === "prev"){
                move = -1;
            }
            let new_index = selected_index + move;
            if(selected_index === (selected_projects.length - 1) && direction === "forw"){
                new_index = 0;

            } else if(selected_index === 0 && direction === "prev"){
                new_index = selected_projects.length - 1;
            };
            
            set_selected_index(new_index);

            console.log(`%c DATA `, `${ log_colors.data }`,`for direction`,'\n' ,direction);
            console.log(`%c DATA `, `${ log_colors.data }`,`for selected_index`,'\n' ,selected_index);
            console.log(`%c DATA `, `${ log_colors.data }`,`for selected_projects`,'\n' ,selected_projects);
            console.log(`%c DATA `, `${ log_colors.data }`,`for selected_projects.length`,'\n' ,selected_projects.length);
            console.log(`%c DATA `, `${ log_colors.data }`,`for new_index`,'\n' ,new_index);
            console.log(`%c DATA `, `${ log_colors.data }`,`for selected_projects[new_index]`,'\n' ,selected_projects[new_index]);

            await update_active_entry.now({target_id:selected_projects[new_index].id});
        }
                
        console.log(`%c DATA `, `${ log_colors.data }`,`for selected_index`,'\n' ,selected_index);
        console.log(`%c DATA `, `${ log_colors.data }`,`for all_projects`,'\n' ,all_projects);
// MEMOS AND EFFECTS

    useEffect(() =>{
        (async () => {
            if(user_data.is_admin){
                const update_all_projects = await fetch_all_projects();
                if(update_all_projects.length !== all_projects!.length){
                    set_all_projects(update_all_projects);
                    set_selected_projects(update_all_projects);
                    set_selected_index(update_all_projects.length -1)
                }
    
            } else {
                const update_selected_projects = await fetch_user_projects();
                if(update_selected_projects.length !== selected_projects.length){
                    set_selected_projects(update_selected_projects);
                    set_selected_index(update_selected_projects.length -1)
                }
            }
        })()
    },[initial_data])

    useEffect(() =>{
        animate_fs.initiate_animation({
                        btn_ele: animate_fs_btn_ref.current!, 
                        box_ele: animate_fs_box_ref.current!, 
                    })
    },[])

// RETURNED VALUES 
    return(
        <div id="project_nav">
            <h1
                id="project_title"
            >
                {project_data.project_name}
            </h1>
            <div className="project_selection">
                {/*{user_data.is_admin && 
                    <button 
                        className="project_selection_switch general_btn"
                        onClick={()=>{set_project_selection(project_selection === "user" ? "all" : "user")}}
                    >
                        <h4>{project_selection === "user" ? "All Projects" : "My Projects"}</h4>

                    </button>
                } */}
                
                <div
                    className="animate_btn_box"
                    ref= {animate_fs_btn_ref}
                >
                    <button 
                        className="general_btn ps_btn"
                        onClick={handle_ps_click}
                    >
                        <h4>Find Project</h4>
                    </button>
                </div>
                
                <div 
                    className="ps_box animate_ele_closed animate_box"
                    ref= {animate_fs_box_ref}    
                >
                    {ps_open &&
                        <Project_search
                            close_dd={handle_ps_click}
                        />
                    }
                </div>
            </div>

            <button
                id="project_nav_left"
                className="project_nav_btn"
                onClick={()=>{change_project("prev")}}
            >
               <p>🠸</p> 
            </button>
            <button
                id="project_nav_right"
                className="project_nav_btn"
                onClick={()=>{change_project("forw")}}
            >
                <p>🠺</p>
            </button>
        </div>
    ); 
}