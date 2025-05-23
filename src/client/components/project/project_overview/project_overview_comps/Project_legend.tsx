import { useContext, useEffect, useMemo, useState } from "react";

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
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Project_legend`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const departments_data = useContext(Use_Context_departments_data).show_context;

    const [legend_items, set_legend_items] = useState<Types_department_data[]>([]);

// MEMOS AND EFFECTS

    useMemo(() =>{
        if(initial_data){
            const update_legend_items:Types_department_data[]= [];

            departments_data.forEach((entry)=>{
            const p_department = initial_data["project_departments"].data.find((s_entry)=>{
                if(s_entry["department_id"] === entry.id){
                    return s_entry
                }
            })
            if(p_department && p_department["budget"] !== "0.00"){
                update_legend_items.push(entry)

            } 
        })

            set_legend_items(update_legend_items);
        }

    },[initial_data])

// RETURNED VALUES 
    return(
        <article id="project_department_legend" className="project_overview_content_box">
            <h3>Department Legend</h3>
            <div className="legend_box_container">
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