import { useContext, useEffect, useMemo, useRef, useState } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../../context/Context_departments_data.js";
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS
interface Types_pie_slice{
    color:string;
    degree:number;
}


// THE COMPONENT 
export default function Pie_chart() {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Pie_chart`);
    const initial_data = useContext(Use_Context_initial_data).show_context;
    const departments_data = useContext(Use_Context_departments_data).show_context;

    const [chart_gradient, set_chart_gradient] = useState<string>()

    function create_chart_data(){
        let current_degree = 0;
        const chart_array:Types_pie_slice[] = [];
        
        departments_data.forEach((entry)=>{
            const p_department = initial_data["project_departments"].data.find((s_entry)=>{
                if(s_entry["department_id"] === entry.id){
                    return s_entry
                }
            })
            if(p_department && p_department["budget"] !== "0.00"){

                const pie_degree = (Number(p_department["budget"]) / Number(initial_data["projects"].data[0]["production_budget"]) )*360 + current_degree;
                current_degree = pie_degree;
                chart_array.push({
                    color: entry.color,
                    degree: pie_degree
                });
            } 
        })


        chart_array.push({
            color: "#FFFFFF",
            degree: 360 - current_degree
        })


        
        const gradient = `conic-gradient(
        ${chart_array.map(item => `${item.color} 0 ${item.degree}deg`)
            .join(", ")
        })`;

        console.log(`%c DATA `, `${ log_colors.data }`,`for gradient`,'\n' ,gradient);
        set_chart_gradient(gradient);
    }



// MEMOS AND EFFECTS

    useMemo(() =>{
        initial_data && create_chart_data()
    },[initial_data])

// RETURNED VALUES 
    if(chart_gradient){
        return (
            <article id="pie_chart" className="project_overview_content_box">
                <h3>Project Budgets</h3>
                <div 
                    className="pie_legend_box"
                >
                    <p>Remaining </p>
                    <div className="legend_color" style={{backgroundColor:"#FFFFFF"}}></div>
                </div>
                <div
                    className="pie_chart_box"
                >
                    <div    
                        id="pie_chart_graphic"
                        style={{backgroundImage: chart_gradient}}
                    />
            
                </div>
            </article>
        );
    }
}
