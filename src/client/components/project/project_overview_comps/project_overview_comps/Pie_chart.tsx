import { useContext } from "react";
// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../../context/Context_departments_data.js";
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../context/Context_active_entry.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";


// TYPE DEFINITIONS
interface Types_pie_slice{
    color:string;
    degree:number;
}


// THE COMPONENT 
export default function Pie_chart() {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Pie_chart`);

    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;
    const departments_data = useContext(Use_Context_departments_data).show_context;

    const n_chart_data:Types_pie_slice[] = create_chart_data()

    function create_chart_data(){
        let current_degree = 0;
        const chart_array:Types_pie_slice[] = initial_data["project_department_budgets"].data.map((entry)=>{
            const pie_color = departments_data.find((s_entry)=>{
                if(s_entry.id === entry["department_id"]){
                    return s_entry
                }
            })?.color!;

            const pie_degree = (Number(entry["budget"]) / Number(initial_data["projects"].data[0]["production_budget"]) )*360 + current_degree;

            current_degree = pie_degree;
            return {
                color: pie_color,
                degree: pie_degree
            }
        });
        return chart_array;
    }

/*
    const chart_data = [
        {
            color:"red",
            degree:70
        },
        {
            color:"blue",
            degree:235
        },
        {
            color:"green",
            degree:0
        }
    ]
*/

    // BUILD PIE CHART 
    const gradient = `conic-gradient(
    ${n_chart_data.map(item => `${item.color} 0 ${item.degree}deg`)
        .join(", ")
    })`;

    console.log(`%c DATA `, `${ log_colors.data }`,`for gradient`,'\n' ,gradient);
// MEMOS AND EFFECTS


// RETURNED VALUES 
    return (
        <div id="pie_chart" className="project_overview_content_box">
            <div    id="pie_chart_graphic"
                    style={{backgroundImage: gradient
                
                    }}
            >

            </div>
        </div>
    );
}
