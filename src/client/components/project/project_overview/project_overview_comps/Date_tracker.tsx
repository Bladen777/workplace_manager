import { useContext, useEffect, useMemo, useRef, useState } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../../styles/_log_colors.js";
import "../../../../styles/project_overview/date_tracker.css"

// CONTEXT IMPORTS 
import { Use_Context_departments_data } from "../../../context/Context_departments_data.js";
import { Use_Context_initial_data } from "../../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../../context/Context_active_entry.js";

// HOOK IMPORTS 

// COMPONENT IMPORTS 

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
    const active_entry = useContext(Use_Context_active_entry).show_context;

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
        //console.log(`%c DATA `, `${ log_colors.data }`,`for number_of_days`,'\n' ,number_of_days);


        return number_of_days * min_width;
      }

      const max_width = find_max_width();

/*
      console.log(`%c DATA `, `${ log_colors.data }`,`for project_date_data`,'\n' ,project_date_data);
      console.log(`%c DATA `, `${ log_colors.data }`,`for tracker_width_ref.current`,'\n' ,tracker_width_ref.current);
      console.log(`%c DATA `, `${ log_colors.data }`,`for tracker_pos_ref.current`,'\n' ,tracker_pos_ref.current);

*/
      if(project_date_data.start && project_date_data.finish){

        update_unique_dates.push({
          date:project_date_data.start,
          position: min_width
        });

        update_tracker_date_data.push({
          ["project"]: {
            start:project_date_data.start,
            finish:project_date_data.finish,
            start_pos: min_width,
            width: max_width,
            color: "#FFFFFF"
          }
        });

        departments_data.forEach((entry)=>{
          const dep_entry =  initial_data["project_departments"].data.find((s_entry)=>{
            if((s_entry["start_date"] && s_entry["finish_date"]) && entry.id === s_entry["department_id"]){
              return s_entry
            }
          })
          if(dep_entry){

            function find_position(){

              const start_date_time = (new Date(project_date_data.start!)).getTime();
              const finish_date_time = (new Date(project_date_data.finish!)).getTime();
      
              const dep_start_time = (new Date(dep_entry!["start_date"]!)).getTime();
              const dep_finish_time = (new Date(dep_entry!["finish_date"]!)).getTime();

              const date_range = finish_date_time - start_date_time;
              const start_pos = ((dep_start_time - start_date_time)/date_range)* max_width + min_width;
              const finish_pos = ((dep_finish_time - start_date_time)/date_range)* max_width + min_width;

              return{
                start: start_pos,
                finish: finish_pos,
                width: finish_pos - start_pos
              }
            }

            const position = find_position()

            if((!update_unique_dates.find((s_entry)=> s_entry.position === position.start)) && position.start !== 0){
              update_unique_dates.push({
                date:String(dep_entry["start_date"]),
                position: position.start
              });
            }

            if((!update_unique_dates.find((s_entry)=> s_entry.position === position.finish)) && position.finish !== max_width + min_width){
              update_unique_dates.push({
                date:String(dep_entry["finish_date"]),
                position: position.finish
              });
            }

            update_tracker_date_data.push({
              [entry.name]:{
                start: String(dep_entry["start_date"]),
                finish: String(dep_entry["finish_date"]),
                start_pos: position.start,
                width: position.width,
                color: entry.color 
              }
            })


          }
        })
        
        if((!update_unique_dates.find((s_entry)=> s_entry.position === max_width + min_width))){
              update_unique_dates.push({
                date:project_date_data.finish,
                position: max_width + min_width
              });
            }

      }

/*
      console.log(`%c DATA `, `${ log_colors.data }`,`for update_unique_dates`,'\n' ,update_unique_dates);
      console.log(`%c DATA `, `${ log_colors.data }`,`for update_tracker_date_data`,'\n' ,update_tracker_date_data);

*/
      set_unique_dates(update_unique_dates);
      set_date_data(update_tracker_date_data);
    }


// MEMOS AND EFFECTS

  useEffect(() =>{
    tracker_width_ref.current = tracker_ele_ref.current && tracker_ele_ref.current.offsetWidth;
    tracker_pos_ref.current = tracker_ele_ref.current && tracker_ele_ref.current.getBoundingClientRect();
    if(initial_data){
      change_date_data()
    };
  },[initial_data]);

// RETURNED VALUES 
  return (
    <article 
      
      id="date_tracker" 
      className="project_overview_content_box"
    >
      <h3>Milestone Dates</h3>
      {date_data[0] && !date_data[0]["project"].width &&
        <p>Add Dates in Edit Project</p>
      
      } 

      {date_data[0] && date_data[0]["project"].width > 0 && 
      <div
        className="date_tracker_date_box"
        ref = {tracker_ele_ref}
      >
        <div className="tracker_unique_date_box">
          {unique_dates.map((entry, index)=>{
            if(index === 0){
              return(
                <div 
                  key = {`unique_date_${index}`}
                  id="tracker_unique_date_start"
                  className="tracker_unique_date tracker_unique_date_end"
                  
                >
                  <p>{`Start: ${entry.date}`}</p>

                </div>
              )
            } else if( index === unique_dates.length -1){
              return(
                <div 
                  key = {`unique_date_${index}`}
                  id="tracker_unique_date_finish"
                  className="tracker_unique_date tracker_unique_date_end"
                  style={{
                    marginLeft:`${entry.position}px`
                  }}
                >
                  <p>{`Finish: ${entry.date}`}</p>

                </div>
              )

            } else {
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
            }
            
          })}
        </div>

        <div className="tracker_graph_box"
              style={date_data[0] && {
                    width:`${date_data[0]["project"].width + 128 + 16}px`,
              }}
        >
            {date_data.map((entry,index)=>{
              if(index !== 0){
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
              }
              
            })}
        </div>
      </div>
    }

    </article>
  ) 
}
