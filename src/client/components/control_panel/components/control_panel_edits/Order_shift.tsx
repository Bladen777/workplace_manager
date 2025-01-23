import { useContext, useEffect, useRef, useState } from "react";


// CUSTOM HOOKS

import useGetTableData from "../hooks/useGetTableData.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../../context/Context_section_name.js";

// TYPE DEFINITIONS
interface Types_mouse_event{
    screenX:number
    screenY:number
}

interface Types_selected_ele{
    name: string
    index: number
}

interface Types_pos{
    x: number
    y: number
}

interface Types_ele_shift{
    top_ele: number
    bottom_ele: number
}

interface Types_ele_shift_amt extends Types_ele_shift{
    target_ele: number
}

interface Types_shift_number{
    up:number,
    down: number
}

import { Types_form_data } from "../../context/Context_db_table_info.js";

// THE COMPONENT
export default function Order_shift() {

const section_name = useContext(Use_Context_Section_Name).show_context;
console.log(`%cSECTION NAME:`, 'background-color:red', section_name);
const initial_table_data:Types_form_data[] = useGetTableData({section_name: section_name, order_item: "id"});

const [table_data, set_table_data] = useState<Types_form_data[]>([]);
const track_table_data = useRef<Types_form_data[]>([])

const current_ele = useRef<HTMLDivElement | null>(null);



// element styling
const pos_track = useRef<boolean>(false);
const [selected_ele, set_selected_ele] = useState<Types_selected_ele>({name:"", index:0});

const ele_shift_targets = useRef<Types_ele_shift>({top_ele:0, bottom_ele:0})
const ele_shift_amt = useRef<Types_ele_shift_amt>({top_ele:0, bottom_ele:0, target_ele:0})
const shift_number = useRef<Types_shift_number>({up:0, down:0})

const start_pos = useRef<Types_pos>({x:0, y:0});
const [ele_pos, set_ele_pos] = useState<Types_pos>({x:0, y:0}); 

const mouse_x= useRef<number>();
const mouse_y = useRef<number>();


    function element_clicked(method:string, key_name:string, index:number){
        //console.log(`%cDepartment element_clicked ${method}`, 'background-color:', );
        if(method === "down"){
            console.log("mouse down started")

            set_selected_ele({name:key_name, index: index});
            start_pos.current = {x: mouse_x.current!, y: mouse_y.current!}
            pos_track.current = true;
            
        }else {
            console.log("mouse up started")
            
            pos_track.current = false;
            set_table_data(track_table_data.current!);
            ele_shift_targets.current = {top_ele:0, bottom_ele:0}
            ele_shift_amt.current = {top_ele:0, bottom_ele:0, target_ele:0}
            shift_number.current = {up:0, down:0};
            set_ele_pos({x:0, y:0});
            
        }
    }

    function track_mouse(event:Types_mouse_event){

        mouse_x.current = event.screenX;
        mouse_y.current = event.screenY;
        if(pos_track.current === true){
            const move_x = event.screenX! - start_pos.current.x!
            const move_y = event.screenY! - start_pos.current.y! 

            const current_ele_height:number = current_ele.current!.clientHeight;

            const ele_current_index = selected_ele.index - shift_number.current.up + shift_number.current.down;
            console.log(`%cThe ele_current_index:  `, 'background-color:olive', ele_current_index );
            if (move_y > current_ele_height && ele_current_index !== table_data.length -1){
                // move index down
                shift_ele("down")
            } else if (current_ele_height + move_y <= 0  && ele_current_index !== 0){
                //move index up
                shift_ele("up")
            } else {
                set_ele_pos({x: move_x, y: move_y});
            }
        }
    }

    function shift_ele(direction:string){
        
        
        const new_table_data:Types_form_data[] = [...track_table_data.current];
        const selected_ele_data = table_data[selected_ele.index];
        let ele_shift:number = 0;

        const ele_current_index = selected_ele.index - shift_number.current.up + shift_number.current.down;
        const target_ele = selected_ele.index; 
        console.log(`%c The Selected Ele is: `, 'background-color:', selected_ele );
        console.log(`%c The target_ele is: `, 'background-color:', ele_current_index );
        
        start_pos.current = {x: mouse_x.current!, y: mouse_y.current!}
      
        ele_shift_targets.current = {top_ele:ele_current_index - 1 ,bottom_ele:ele_current_index + 1}
        if (direction === "down" ){
            console.log(`%c Move Index Down: `, 'background-color:brown', );
            shift_number.current.down ++;
            ele_shift = ele_current_index + shift_number.current.down;
            ele_shift_amt.current = {top_ele:0, bottom_ele: -shift_number.current.down, target_ele: shift_number.current.down}
        } else if (direction === "up") {
            console.log(`%c Move Index Up: `, 'background-color:brown', );
            shift_number.current.up ++;
            ele_shift = ele_current_index - shift_number.current.up;
            ele_shift_amt.current = {top_ele: shift_number.current.up, bottom_ele:0, target_ele: -shift_number.current.up}
        } 

            new_table_data.splice(ele_current_index, 1);
            new_table_data.splice(ele_shift,0, selected_ele_data);
            track_table_data.current = new_table_data;
            set_ele_pos({x: 0, y: 0});
 
   }

    function create_inputs(item:Types_form_data, index:number){
        let key_name = `dep_ele_${index}`
        const row = index + 1;
        //console.log("the item data: ", item)
        //console.log("the table data: ", table_data.findIndex())

        return(
            <div
                ref={key_name === selected_ele.name ? current_ele : undefined }
                key={key_name}
                className="department_element"
                onMouseMove={(e)=>{track_mouse(e)}}

                style={{
                    transform: `translate(${key_name === selected_ele.name && `${ele_pos.x}px , ${ele_pos.y}px`})`,
                    gridRow: `${
                        // element above adjustments
                        index === ele_shift_targets.current.top_ele ? 
                        row + ele_shift_amt.current.top_ele : 
                        // element below adjustments
                        index === ele_shift_targets.current.bottom_ele ? 
                        row + ele_shift_amt.current.bottom_ele :
                        // target element adjustments
                        index === selected_ele.index ?
                        row + ele_shift_amt.current.target_ele :
                        row
                    }`,
                    zIndex: `${key_name === selected_ele.name  ? 99 : 1}`
                }}    
            >
                <div 
                    className="grab_box"
                    onMouseDown={()=>{element_clicked("down", key_name, index)}} 
                    onMouseUp={()=>{pos_track.current && element_clicked("up","", index )}}
                    onMouseOut={()=>{pos_track.current && element_clicked("out", "", index)}}     
                >
                    O
                </div>
                    {item.department_name}
                
            </div>
        )
    }

    useEffect(() =>{
      set_table_data(initial_table_data);
      track_table_data.current = initial_table_data;
    },[initial_table_data]);

  return (
    <figure id="department_elements">
        {table_data && table_data.map(create_inputs)}
    </figure>
  )
}
