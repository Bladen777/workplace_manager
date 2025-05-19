import { useContext, useEffect, useState } from "react";

// STYLE IMPORTS
    /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../../context/Context_departments_data.js";
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS
import { Types_department_data } from "../../../context/Context_departments_data.js";

// THE COMPONENT 
export default function Project_legend() {
    console.log(`%c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_legend`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const departments_data = useContext(Use_Context_departments_data).show_context;

    const [legend_items, set_legend_items] = useState<Types_department_data[]>([]);

// MEMOS AND EFFECTS

    useEffect(() =>{
        const update_legend_items:Types_department_data[]= [];
        initial_data["project_departments"].data.forEach((entry)=>{
            if(entry["budget"] !== "0.00"){
                departments_data.find((s_entry)=>{
                    if(entry["department_id"] === s_entry.id){
                        update_legend_items.push(s_entry)
                        return
                    }
                })
            }
        })
        set_legend_items(update_legend_items);
    },[initial_data])

// RETURNED VALUES 
    return(
        <article id="project_department_legend" className="project_overview_content_box">
            <h3>Legend</h3>
            <div className="legend_box_container">
                <div 
                    className="legend_box"
                >
                    <p>Remaining </p>
                    <div className="legend_color" style={{backgroundColor:"#FFFFFF"}}></div>
                </div>
                {legend_items.map((entry)=>{
                    return(
                        <div 
                            key={`legend_box_for_${entry.name}`}
                            className="legend_box"
                        >
                            <p>{entry.name}</p>
                            <div className="legend_color" style={{backgroundColor:entry.color}}></div>
                        </div>
                    )
                })}
            </div>
            

        </article>
    ); 
}