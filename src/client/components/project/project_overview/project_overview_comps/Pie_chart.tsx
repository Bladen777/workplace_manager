export default function Pie_chart() {


    // Degree will need to be retrieved from employee budgets
    // color will be retrieved from departments 

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
 
 
    return (
    <div id="pie_chart" className="project_overview_content_box">
        Pie_chart
        <div    id="pie_chart_graphic"
                style={{backgroundImage: gradient
             
                }}
        >

        </div>
    </div>
  )
}
