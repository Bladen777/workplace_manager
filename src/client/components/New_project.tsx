import { useState } from "react";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
import "../styles/new_project.css"

// LOG STYLE 
import { log_colors } from "../styles/_log_colors.js";


// TYPE DEFINITIONS

// THE COMPONENT 
export default function New_project() {
    console.log(`%c COMPONENT `, `background-color:${ log_colors.component }`, `New_project`);

    const [new_btn_clicked, set_new_btn_clicked] = useState<boolean | null>(null);

    function handle_new_project_click(){
        if(new_btn_clicked === null){
            set_new_btn_clicked(true);
        } else {
            set_new_btn_clicked(!new_btn_clicked)
        }
    }

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for new_btn_clicked`,'\n' ,new_btn_clicked);
    // RETURNED VALUES 
    return(
        <section id="new_project_box" >
            <button 
                key={Math.random()}
                className={
                    new_btn_clicked ? "new_project_btn_close new_project_btn" : 
                    new_btn_clicked === false ? "new_project_btn_open new_project_btn" :
                    "new_project_btn"
                }
                onClick={handle_new_project_click}
            >
                <h2>New Project</h2>
            </button>
            <div
                key={Math.random()}
                className={
                    new_btn_clicked ? "new_project_input_box_open new_project_input_box general_section" : 
                    new_btn_clicked === false ? "new_project_input_box_close new_project_input_box general_section" :
                    "new_project_input_box"
                }
            >
                <h2> New Project</h2>    
                <button 
                    className="new_project_done_btn"
                    onClick={handle_new_project_click}
                >
                    <h3>Done</h3>    
                </button>                    

            </div>
        </section>
    ); 
}