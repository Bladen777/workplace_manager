import { useContext, useEffect, useState } from "react";

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
        
        initial_data["project_departments"].data.forEach((entry)=>{
            if(entry["budget"] !== "0.00"){
                const pie_color = departments_data.find((s_entry)=>{
                    if(s_entry.id === entry["department_id"]){
                        return s_entry
                    }
                })?.color!;

                const pie_degree = (Number(entry["budget"]) / Number(initial_data["projects"].data[0]["production_budget"]) )*360 + current_degree;

                current_degree = pie_degree;
                chart_array.push({
                    color: pie_color,
                    degree: pie_degree
                });

            }
        });

        chart_array.push({
            color: "#FFFFFF",
            degree: 360 - current_degree
        })


        
        const gradient = `conic-gradient(
        ${chart_array.map(item => `${item.color} 0 ${item.degree}deg`)
            .join(", ")
        })`;

        set_chart_gradient(gradient);
    }


    console.log(`%c DATA `, `${ log_colors.data }`,`for gradient`,'\n' ,chart_gradient);
// MEMOS AND EFFECTS
useEffect(() =>{
        create_chart_data()
},[initial_data])

// RETURNED VALUES 
    return (
        <article id="pie_chart" className="project_overview_content_box">
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
