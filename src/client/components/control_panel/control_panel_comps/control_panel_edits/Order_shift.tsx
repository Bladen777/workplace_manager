import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";


// CUSTOM HOOKS

import useGetTableData from "../hooks/useGetTableData.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../../Context_section_name.js";

// TYPE DEFINITIONS
interface Types_mouse_event{
    screenX:number
    screenY:number
}

import { Types_form_data } from "../hooks/useDBTableColumns.js";



// THE COMPONENT
export default function Order_shift() {

const section_name = useContext(Use_Context_Section_Name).show_context;
const table_data = useGetTableData({section_name: section_name}); 


// element styling
const [pos_track, set_pos_track] = useState<boolean>(false);
const [selected_ele, set_selected_ele] = useState<string>("")
const [ele_shift, set_ele_shift] = useState<number>(0)
const [ele_target_shift, set_ele_target_shift] = useState<number>(0)
const number_of_elements:number = table_data.length;

const [start_x_pos,set_start_x_pos] = useState<number>(0);
const [start_y_pos,set_start_y_pos] = useState<number>(0);
const [x_pos, set_x_pos] = useState<number>();
const [y_pos, set_y_pos] = useState<number>();
const [mouse_x, set_mouse_x] = useState<number>();
const [mouse_y, set_mouse_y] = useState<number>();





    function element_clicked(method:string, key_name:string, index:number){
        //console.log(`%cDepartment element_clicked ${method}`, 'background-color:', );
        if(method === "down"){
            console.log("mouse down started")

            set_ele_target_shift(index);
            set_selected_ele(key_name);
            set_start_x_pos(mouse_x!);
            set_start_y_pos(mouse_y!);
            set_pos_track(true);
            
            
            
        }else {
            console.log("mouse up started")

            set_pos_track(false);
         
            set_x_pos(0);
            set_y_pos(0);
        }
    }

    function track_mouse(event:Types_mouse_event){
        set_mouse_x(event.screenX);
        set_mouse_y(event.screenY);

        if(pos_track === true){
        const move_x = event.screenX! - start_x_pos!
        const move_y = event.screenY! - start_y_pos! 

        set_x_pos(move_x);
        set_y_pos(move_y);
        }
    }


    function create_inputs(item:Types_form_data, index:number){
        let key_name = `dep_ele_${index}`

        return(
            <div
                key={key_name}
                className="department_element"
                onMouseMove={(e)=>{track_mouse(e)}}

                style={{
                    transform: `translate(${selected_ele === key_name && x_pos}px , ${selected_ele === key_name && y_pos}px)`,
                    gridRow: `${key_name !== selected_ele ? index + 1 + ele_shift: ele_target_shift + 1}`,
                    zIndex: `${key_name === selected_ele ? 99 : 1}`
                }}    
            >
                <div 
                    className="grab_box"
                    onMouseDown={()=>{element_clicked("down", key_name, index)}} 
                    onMouseUp={()=>{pos_track && element_clicked("up","", index )}}
                    onMouseOut={()=>{pos_track && element_clicked("out", "", index)}}     
                >
                    O
                </div>
                    {item.department_name}
                
            </div>
        )
    }

  return (
    <figure id="department_elements">
        {table_data.map(create_inputs)}
    </figure>
  )
}
