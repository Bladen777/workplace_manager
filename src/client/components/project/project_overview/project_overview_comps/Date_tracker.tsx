import { useContext, useEffect, useMemo, useRef, useState } from "react";
// COMPONENT IMPORTS 

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../../context/Context_departments_data.js";
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
import "../../../../styles/project_overview/date_tracker.css"

// TYPE DEFINITIONS
import { Types_department_data } from "../../../context/Context_departments_data.js";

interface Types_tracker_date_data {
  [key:string]:{
    start:string;
    finish:string;
    start_pos:number;
    width: number;
    color:string;
  }
}

interface Types_unique_dates{
  date:string;
  position:number;
}


// THE COMPONENT 
export default function Date_tracker() {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Date_tracker`);

    const departments_data = useContext(Use_Context_departments_data).show_context;
    const initial_data = useContext(Use_Context_initial_data).show_context;

    const tracker_ele_ref = useRef<HTMLDivElement | null>(null);
    const tracker_pos_ref = useRef<DOMRect | null>(null);
    const tracker_width_ref = useRef<number | null>(null);
    
    const [date_data, set_date_data] = useState<Types_tracker_date_data[]>([]);
    const [unique_dates, set_unique_dates] = useState<Types_unique_dates[]>([]);

    function change_date_data(){
      const min_width = 64;

      const update_tracker_date_data:Types_tracker_date_data[] = [];
      const update_unique_dates:Types_unique_dates[] = [];

      const project_date_data = {
        start:String(initial_data["projects"].data[0]["start_date"]),
        finish:String(initial_data["projects"].data[0]["finish_date"])
      };

      function find_max_width(){
        const start_date_time = (new Date(project_date_data.start!)).getTime();
        const finish_date_time = (new Date(project_date_data.finish!)).getTime();

        const number_of_days = (finish_date_time - start_date_time)/(1000*60*60*24)
        console.log(`%c DATA `, `${ log_colors.data }`,`for number_of_days`,'\n' ,number_of_days);


        return number_of_days * min_width;
      }

      const max_width = find_max_width();

      console.log(`%c DATA `, `${ log_colors.data }`,`for project_date_data`,'\n' ,project_date_data);
      console.log(`%c DATA `, `${ log_colors.data }`,`for tracker_width_ref.current`,'\n' ,tracker_width_ref.current);
      console.log(`%c DATA `, `${ log_colors.data }`,`for tracker_pos_ref.current`,'\n' ,tracker_pos_ref.current);

      if(project_date_data.start && project_date_data.finish){

        update_tracker_date_data.push({
          ["project_date_data"]: {
            start:project_date_data.start,
            finish:project_date_data.finish,
            start_pos: 0,
            width: max_width,
            color: "#FFFFFF"
          }
        });
        
        initial_data["project_departments"].data.forEach((entry)=>{
          if(entry["start_date"] && entry["finish_date"]){
            const dep_data:Types_department_data = departments_data.find((s_entry)=>{
                return s_entry.id === entry["department_id"]!;
              } 
            )!;
            
            function find_position(){

              const start_date_time = (new Date(project_date_data.start!)).getTime();
              const finish_date_time = (new Date(project_date_data.finish!)).getTime();
      
              const dep_start_time = (new Date(entry.start_date!)).getTime();
              const dep_finish_time = (new Date(entry.finish_date!)).getTime();

              const date_range = finish_date_time - start_date_time;
              const start_pos = ((dep_start_time - start_date_time)/date_range)* max_width;
              const finish_pos = ((dep_finish_time - start_date_time)/date_range)* max_width;

              return{
                start: start_pos,
                finish: finish_pos,
                width: finish_pos - start_pos
              }
            }

            const position = find_position()

            console.log(`%c DATA `, `${ log_colors.data }`,`for position`,'\n' ,position);

            
            if((!update_unique_dates.find((s_entry)=> s_entry.position === position.start)) && position.start !== 0){
              update_unique_dates.push({
                date:String(entry["start_date"]),
                position: position.start
              });
            }

            if((!update_unique_dates.find((s_entry)=> s_entry.position === position.finish)) && position.finish !== max_width){
              update_unique_dates.push({
                date:String(entry["finish_date"]),
                position: position.finish
              });
            }

            update_tracker_date_data.push({
              [dep_data.name]:{
                start: String(entry["start_date"]),
                finish: String(entry["finish_date"]),
                start_pos: position.start,
                width: position.width,
                color: dep_data.color 
              }
            })
          }

        })  
      }
      console.log(`%c DATA `, `${ log_colors.data }`,`for update_unique_dates`,'\n' ,update_unique_dates);
      console.log(`%c DATA `, `${ log_colors.data }`,`for update_tracker_date_data`,'\n' ,update_tracker_date_data);
      set_unique_dates(update_unique_dates);
      set_date_data(update_tracker_date_data);
    }


// MEMOS AND EFFECTS
useEffect(() =>{
  tracker_width_ref.current = tracker_ele_ref.current && tracker_ele_ref.current.offsetWidth;
  tracker_pos_ref.current = tracker_ele_ref.current && tracker_ele_ref.current.getBoundingClientRect();
  change_date_data()
  
},[initial_data])

// RETURNED VALUES 
  return (
    <article 
      
      id="date_tracker" 
      className="project_overview_content_box"
    >
      <div
        className="tracker_main_dates"
      >
        <p className="tracker_start_date"> Start: {initial_data["projects"].data[0]["start_date"]}</p>
        <h3>Progress Dates</h3>
        <p className="tracker_finish_date"> Finish: {initial_data["projects"].data[0]["finish_date"]}</p>
      </div>
      
      <div
        className="date_tracker_date_box"
        ref = {tracker_ele_ref}
      >
        <div className="tracker_unique_date_box">
          {unique_dates.map((entry, index)=>{
            return(
              <div 
                key = {`unique_date_${index}`}
                className="tracker_unique_date"
                style={{
                  marginLeft:`${entry.position}px`
                }}
              >
                <p>{entry.date}</p>

              </div>
            )
          })}
        </div>

        <div className="tracker_graph_box">
            {date_data.map((entry)=>{
              const key_name = Object.keys(entry)[0];
              return(
                <div
                  key={`date_tracker_for_${key_name}`}
                  className="tracker_graph"
                  style={{
                    width:`${entry[key_name].width}px`,
                    backgroundColor:`${entry[key_name].color}`,
                    marginLeft:`${entry[key_name].start_pos}px`
                  }}

                >
                </div>
              )
            })}
        </div>
      </div>


    </article>
  ) 
}
