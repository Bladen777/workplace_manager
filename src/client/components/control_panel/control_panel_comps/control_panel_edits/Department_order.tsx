import axios from "axios";
import { useEffect, useRef, useState } from "react";


// CUSTOM HOOKS
import useDBTableColumns from "../hooks/useDBTableColumns.js";
import useGetTableData from "../hooks/useGetTableData.js";

// TYPE DEFINITIONS
import { Types_column_info } from "../hooks/useDBTableColumns.js";

export default function Department_order() {

const table_data = useGetTableData({section_name:"departments"}); 


// element styling
const [position, set_position] = useState<string>("relative");
const [pos_track, set_pos_track] = useState<boolean>(false);
const [selected_ele, set_selected_ele] = useState<string>("")

const [start_x_pos,set_start_x_pos] = useState<number>(0);
const [start_y_pos,set_start_y_pos] = useState<number>(0);
const [x_pos, set_x_pos] = useState<number>();
const [y_pos, set_y_pos] = useState<number>();
const [mouse_x, set_mouse_x] = useState<number>();
const [mouse_y, set_mouse_y] = useState<number>();





    function element_clicked(method:string){
        //console.log(`%cDepartment element_clicked ${method}`, 'background-color:', );
        if(method === "down"){
            console.log("mouse down started")
     
            set_start_x_pos(mouse_x!)
            set_start_y_pos(mouse_y!)
            set_pos_track(true)
            
            
            
        }else {
            console.log("mouse up started")

            set_pos_track(false);
         
            set_x_pos(0);
            set_y_pos(0);
        }
    }

    function track_mouse(event){
        set_mouse_x(event.screenX);
        set_mouse_y(event.screenY);

        if(pos_track === true){
        const move_x = event.screenX! - start_x_pos!
        const move_y = event.screenY! - start_y_pos! 

        set_x_pos(move_x);
        set_y_pos(move_y);
        }
    }

    // GET THE EXISTING INFOMATION 
    async function get_table_range(item_name:string){
        try {
            const response = await axios.post("/get_table_info", {
                table_name: "departments",
                }
            )
            const data:number = response.data.length + 1;
            console.log("the table range: ", data)
            return data
        } catch (error) {
            console.log('%cError getting table range: ', 'background-color:darkred',error);
        }  
    }

    useEffect(() =>{
      get_table_range
    },[])

    function create_inputs(item, index:number){

        const key_name = `dep_ele_${index}`

        return(
            <div
                key={key_name}
                className="department_element"
                onMouseMove={(e)=>{track_mouse(e)}}

                style={{
                    transform: `translate(${selected_ele === key_name && x_pos}px , ${selected_ele === key_name && y_pos}px)`
                }}    
            >
                <div 
                    className="grab_box"
                    onClick={()=>{set_selected_ele(key_name)}}
                    onMouseDown={()=>{element_clicked("down")}} 
                    onMouseUp={()=>{element_clicked("up")}}
                    onMouseOut={()=>{element_clicked("out")}}     
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
