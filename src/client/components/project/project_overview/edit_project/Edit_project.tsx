import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS 
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";
import Process_input_data from "../../../_universal/Process_input_data.js";
import Clients_dd from "../../../_universal/drop_downs/Clients_dd.js";
import Pd_input from "./project_departments/Pd_input.js";

// CONTEXT IMPORTS 
import { Use_Context_project_data } from "../../context/Context_project_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
import "../../../../styles/project/edit_project.css"
import "../../../../styles/_universal/form_dd.css"

// TYPE DEFINITIONS
import { Types_form_data } from "../../../control_panel/context/Context_db_table_info.js";
import { Types_column_info } from "../../../control_panel/context/Context_db_table_info.js";
import { Types_data_change } from "../../../_universal/Process_input_data.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";


interface Types_project_keys {
    btn_key: number;
    input_box_key: number;
}

interface Types_budget {
    total: number;
    remaining: number;
    percent: number;

}

interface Types_adjust_budget{
    total?: number;
    used?: number;
}




// THE COMPONENT 
export default function Edit_project() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.component }`, `Edit_project`);

    const initial_form_data = useContext(Use_Context_project_data).show_context.table_info.initial_form_data;
    const db_column_info = useContext(Use_Context_project_data).show_context.table_info.db_column_info;
    const current_project = useContext(Use_Context_project_data).show_context.current_project;

    const update_current_project = useContext(Use_Context_project_data).update_func;
    const process_data = Process_input_data();
    
    const edit_btn_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_input_box_ref = useRef<HTMLDivElement | null>(null);
    const edit_btn_ref = useRef<HTMLButtonElement | null>(null);
    const add_btn_ref = useRef<HTMLButtonElement | null>(null);
    const btn_type = useRef<string>("");

    const [status_message, set_status_message] = useState<string>("");
    const [edit_btn_clicked, set_edit_btn_clicked] = useState<boolean>(false);

    const [production_budget, set_production_budget] = useState<Types_budget>({
        total: 0,
        remaining: 0,
        percent: 0
    })
    const production_budget_ref = useRef<Types_budget>({
        total: 0,
        remaining: 0,
        percent: 0
    })

    function run_animation(open:boolean){

        interface Types_animation_ele{
            ele: HTMLDivElement;
            animation: string;
        }

        const ele_1:Types_animation_ele = {
            ele: edit_btn_box_ref.current!,
            animation: "toggle_btn_box_visibility 0.5s"
        }

        const ele_2:Types_animation_ele = {
            ele: edit_input_box_ref.current!,
            animation: "toggle_input_box_visibility 1s"
        }

        const open_btn_ele = btn_type.current === "add" ? add_btn_ref.current! : edit_btn_ref.current!;
        const close_btn_ele = btn_type.current !== "add" ? add_btn_ref.current! : edit_btn_ref.current!;

        const start:Types_animation_ele = open ? ele_1 : ele_2;
        const end:Types_animation_ele = !open ? ele_1 : ele_2;
        const animation_direction = open ? "normal" : "reverse";


        if(open){
            button_animation()
            //start_animation()
        } else {
            start_animation()
        }
        

        function button_animation(){
            open_btn_ele.style.animation = `toggle_selected_btn 0.5s ease ${animation_direction} forwards`;
            close_btn_ele.style.animation = `toggle_hidden_btn 0.5s ease ${animation_direction} forwards`;

            if(open){
                open_btn_ele.addEventListener("animationend", btn_animation);
            } else {
                open_btn_ele.addEventListener("animationend", btn_animation);
                open_btn_ele.classList.toggle("btn_open");
                close_btn_ele.classList.toggle("btn_close");
            }

            function btn_animation(){
                if(open){
                    open_btn_ele.classList.toggle("btn_open");
                    close_btn_ele.classList.toggle("btn_close");
                    open_btn_ele.style.animation = "";
                    close_btn_ele.style.animation = "";
                    open_btn_ele.removeEventListener("animationend", btn_animation);

                    //start_animation()
                    setTimeout(()=>{start_animation()},1)
                } else {
                    open_btn_ele.removeEventListener("animationend", btn_animation);
                    open_btn_ele.style.animation = "";
                    close_btn_ele.style.animation = "";
                }
            }
            
        }


        function start_animation(){
            start.ele.style.animation = `${start.animation} ease-in ${animation_direction} forwards`
            start.ele.addEventListener("animationend", adjust_animation_1);
        }

        function adjust_animation_1(){
            start.ele.classList.toggle("box_closed")
            start.ele.style.animation = "";
            start.ele.removeEventListener("animationend", adjust_animation_1);

            end.ele.classList.toggle("box_closed")
            end.ele.style.animation = `${end.animation} ease-out ${animation_direction} forwards`
            end.ele.addEventListener("animationend", adjust_animation_2);
        }

        function adjust_animation_2(){
            end.ele.style.animation = "";
            end.ele.removeEventListener("animationend", adjust_animation_2);
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for animation done`);
            if(!open){
                button_animation()
            }
        }

    }

    async function handle_edit_project_click({submit_method}:{submit_method?:string} = {}){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for edit_btn_clicked`,'\n' ,edit_btn_clicked);
        
        if(edit_btn_clicked){
            set_edit_btn_clicked(false)
            run_animation(false);

        } else {
            btn_type.current = submit_method!; 
            set_edit_btn_clicked(true);
            run_animation(true);   
        }
        
        if(submit_method && submit_method !== current_project.submit_method){
            console.log(`%c IMPORTANT `, `background-color:${ log_colors.important }`,`for submit_method ${submit_method} and current_project submit_method: ${current_project.submit_method}`);
            const current_project_update = await update_current_project.wait({submit_method:submit_method})
            await update_current_project.update_context(current_project_update)
        }
    }

    function handle_form_change({form_data}:Types_data_change){
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for form_data`,'\n' ,form_data);

        if(!Array.isArray(form_data)){
            if(form_data.db_column === "production_budget"){
                const budget = Number(form_data.input);
                callback_adjust_budget({total:budget});
            }
        } else {
            if( typeof(form_data[0].db_column) === "string"){
                if(form_data[0]["production_budget"]){
                    const budget = Number(form_data[0]["production_budget"]);
                    callback_adjust_budget({total:budget})
          
                }
            }
        }
        process_data.handle_form_change({table_name: "Projects", form_data: form_data})
    }


    
    const callback_adjust_budget = useCallback(({total, used}:Types_adjust_budget)=>{
        adjust_budget({total ,used})
    },[production_budget.total])


    function adjust_budget({total, used}:Types_adjust_budget){
        let budget:Types_budget ={...production_budget_ref.current};
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for budget`,'\n' ,budget);

        if(total){
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for total`,'\n' ,total);
            budget.total = total
            if(production_budget_ref.current.remaining < 0){
                budget.remaining = Number((budget.total + production_budget_ref.current.remaining).toFixed(2));
            } else {
                budget.remaining = Number((budget.total - production_budget_ref.current.remaining).toFixed(2));
            }
            
        }
    
        if(used){
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for used`,'\n' ,used);
            budget.remaining = Number((production_budget_ref.current.remaining - used).toFixed(2));
        } 

        if(budget.total > 0){
            budget.percent = Number((((budget.total - budget.remaining)/budget.total)*100).toFixed(2));
        } else {
            budget.percent = 100;
        }
        

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for budget`,'\n' ,budget);
        production_budget_ref.current = budget;
        set_production_budget(budget);
    }

    async function post_form(){
        const response:string = await process_data.post_form({submit_method:current_project.submit_method})
        set_status_message(response)
    }

// MEMOS AND EFFECTS    
    useEffect(() =>{
        handle_form_change({table_name:"projects", form_data:[current_project.current_table_item]})
    },[])

    

    console.log(`%c DATA `, `background-color:${ log_colors.important }`,`for production_budget`,'\n' ,production_budget);

// RETURNED VALUES 
    return(
        <section id="edit_project_container" >
            <div
                ref = {edit_btn_box_ref}
                className="edit_project_btn_box"
            >

                <button 
                    ref = {add_btn_ref}
                    className="add_project_btn edit_project_btn"
                    onClick={()=>handle_edit_project_click({submit_method:"add"})}
                >
                    <h2>New Project</h2>
                </button>

                <button
                    ref = {edit_btn_ref}
                    className="edit_project_btn edit_project_btn"
                    onClick={()=>handle_edit_project_click({submit_method:"edit"})}
                >
                    <h2>Edit Project</h2>
                </button>
            </div>

            <article
                ref = {edit_input_box_ref} 
                className="edit_project_box general_section box_closed"
            >
                <div className="edit_project_input_box">
                    <h2> {current_project.submit_method} Project</h2>
                    <form 
                        className="auto_form"
                    >
                        {db_column_info.map((column:Types_column_info)=>{
                            if(column.column_name.includes("client")){
                                return(
                                    <Clients_dd
                                        key={`input_for_${column.column_name}`}
                                        send_table_data = {(form_data:Types_input_change)=>{handle_form_change({form_data:form_data})}}
                                    />
                                )
                            } else {
                                return(
                                    <Form_auto_input
                                        key={`input_for_${column.column_name}`}
                                        column_info = {column}
                                        table_data_object={initial_form_data}
                                        send_table_data = {(form_data:Types_input_change)=>{handle_form_change({form_data:form_data})}}
                                    />
                                )
                            }
                        })}
                    </form>
                    <div 
                        id="project_budget_tracker"      
                        className={production_budget.remaining < 0 ? "over_budget" : "under_budget"}
                    >
                        <p>Total Budget: ${production_budget.total}</p>
                        <p>Remaining Budget: ${production_budget.remaining}</p>
                        <p>Budget Used: {production_budget.percent}%</p>
                    </div>

                    <Pd_input 
                        total_production_budget={production_budget.total} 
                       // edit_btn_clicked={edit_btn_clicked}
                        adjust_budget_used={callback_adjust_budget} 
                    />

                    <div className="edit_project_utility_bar">
                        <button id="edit_project_done_btn" type="button"
                                className="general_btn"
                                onClick={post_form}
                        >
                            Done  
                        </button>
                        <button id="edit_project_cancel_btn" type="button" 
                                className="general_btn" 
                                onClick={()=>handle_edit_project_click()}
                        > 
                        {status_message !== "" ? "Return" : "Cancel"}
                        </button>
                        {status_message !== "" &&
                            <h3>{status_message}</h3>
                        }
                    </div>                    
                </div>
                
            </article>
        </section>
    ); 
}