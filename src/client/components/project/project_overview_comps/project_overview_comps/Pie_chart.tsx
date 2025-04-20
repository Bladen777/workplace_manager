// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Pie_chart() {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `Pie_chart`);


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

    // BUILD PIE CHART 
    const gradient = `conic-gradient(${chart_data
        .map(item => `${item.color} 0 ${item.degree}deg`)
        .join(", ")
    })`;

// MEMOS AND EFFECTS


// RETURNED VALUES 
    return (
        <div id="pie_chart" className="project_overview_content_box">
            Pie_chart
            <div    id="pie_chart_graphic"
                    style={{backgroundImage: gradient
                
                    }}
            >

            </div>
        </div>
    );
}
