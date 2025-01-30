import { useContext, useEffect, useRef, useState } from "react";

// CUSTOM HOOKS
import useGetTableData from "../hooks/useGetTableData.js";

// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";

// TYPE DEFINITIONS
interface Types_props{
    element_names: string;
    send_form_data: Function;
    submit_method: string;
}

interface Types_mouse_event{
    screenX:number;
    screenY:number;
}

interface Types_pos{
    x: number;
    y: number;
}

interface Types_selected_ele_pos{
    start: number;
    adjust: number;
}

import { Types_form_data } from "../../context/Context_db_table_info.js";

// THE COMPONENT
export default function Order_shift({element_names, send_form_data, submit_method}:Types_props) {

const section_name = useContext(Use_Context_Section_Name).show_context;

const db_column_names = useContext(Use_Context_Table_Info).show_context.db_column_info.map((item)=>item.column_name);

const initial_table_data:Types_form_data[] = useGetTableData({section_name: section_name, order_key: "order"});
const [table_data, set_table_data] = useState<Types_form_data[]>([]);

const current_ele_div_ref = useRef<HTMLDivElement | null>(null);
 
const pos_track = useRef<boolean>(false);
const [selected_ele_name, set_selected_ele_name] = useState<string>("");
const selected_ele_pos = useRef<Types_selected_ele_pos>({start:0, adjust:0})
const shift_ele_direction = useRef<string>("")
const start_pos = useRef<Types_pos>({x:0, y:0});

const [ele_pos, set_ele_pos] = useState<Types_pos>({x:0, y:0}); 
const mouse_x= useRef<number>();
const mouse_y = useRef<number>();

    function element_clicked(method:string, key_name:string, index:number){
        if(method === "down"){
            
            start_pos.current = {x: mouse_x.current!, y: mouse_y.current!}
            pos_track.current = true;
            selected_ele_pos.current = {start: index , adjust: index};
            set_selected_ele_name(key_name);
        }else {
            const new_table_data = adjust_table_data(index)
            pos_track.current = false;
            shift_ele_direction.current = "";
            set_ele_pos({x:0, y:0});
            set_selected_ele_name("");
            set_table_data(new_table_data);
        }
    }

    function adjust_table_data(index:number){
        const new_table_data:Types_form_data[] = [...table_data];
        new_table_data.splice(selected_ele_pos.current.start, 1);
        new_table_data.splice(selected_ele_pos.current.adjust, 0, table_data[index]);
        new_table_data.map((item, index)=>{
            const item_order_key:string | undefined = (Object.keys(item)).find((key_name: string) => {
                if(key_name.includes("order")){
                    return key_name;
                } 
            });
            item[item_order_key!] =`${index + 1}`;
        })
        console.log(`%cnew_table_data: `, 'background-color:olive',new_table_data );
        return new_table_data;
    }

    function track_mouse(event:Types_mouse_event){

        mouse_x.current = event.screenX;
        mouse_y.current = event.screenY;
        if(pos_track.current === true){

            let move_x = event.screenX! - start_pos.current.x!
            let move_y = event.screenY! - start_pos.current.y! 
            const current_ele_height:number = current_ele_div_ref.current!.offsetHeight;
            const ele_margin:number = Number(window.getComputedStyle(current_ele_div_ref.current!).getPropertyValue('margin-top').replace(/[^0-9]/g , ''));
            const ele_size = current_ele_height + ele_margin*2;
            
            function check_to_shift(){ 
                if (move_y > ele_size && selected_ele_pos.current.adjust < table_data.length){
                    // move index down
                    selected_ele_pos.current.adjust ++ ;
                } else if (ele_size + move_y <= 0  && selected_ele_pos.current.adjust !== 0){
                    //move index up
                    selected_ele_pos.current.adjust -- ;
                } else {
                    return
                };
                start_pos.current = {x: mouse_x.current!, y: mouse_y.current!}
                move_x = 0;
                move_y = 0;

                if(selected_ele_pos.current.adjust > selected_ele_pos.current.start){
                    shift_ele_direction.current = "down";
                } else if (selected_ele_pos.current.adjust < selected_ele_pos.current.start){
                    shift_ele_direction.current = "up";
                } else {
                    shift_ele_direction.current = "";
                    return
                };
                console.log("the Size of the element: ", current_ele_height);
                console.log("the Size of the element margin: ", ele_margin);
                console.log(`%c selected_ele_name:  `, 'background-color:olive', selected_ele_name); 
                console.log(`%c Move element up`, 'background-color:blue', selected_ele_pos.current);
                console.log(`%c Shift is: `, 'background-color:darkblue', shift_ele_direction.current );
            }  
            check_to_shift();
            set_ele_pos({x: move_x, y: move_y});
        }
    }

    function create_inputs(item:Types_form_data, index:number){
        console.log("the current item: ", item);
        let key_name = `dep_ele_${index}`
        const row = index + 1;
        const item_name_key:string | undefined = db_column_names.find((key_name: string) => {
            if(key_name.includes("name")){
                return key_name;
            } 
        });
        return(
            <figure
                ref={key_name === selected_ele_name ? current_ele_div_ref : undefined }
                key={key_name}
                className={`o_shift_element ${element_names}_o_shift_element`}
                onMouseMove={(e)=>{track_mouse(e)}}

                style={{
                    transform: `translate(${
                        key_name === selected_ele_name ? 
                        `${ele_pos.x}px , ${ele_pos.y}px`:
                        `0px , 0px`
                    })`,
                    gridRow: `${
                        // element above adjustments
                        shift_ele_direction.current === "up" && index < selected_ele_pos.current.start && index >= selected_ele_pos.current.adjust 
                        ? row + 1 
                        : 
                        // element below adjustments
                        shift_ele_direction.current === "down" && index > selected_ele_pos.current.start && index <= selected_ele_pos.current.adjust 
                        ? row - 1 
                        : 
                        // target element adjustments
                        key_name === selected_ele_name 
                        ? selected_ele_pos.current.adjust + 1 
                        : 
                        row
                    }`,
                    zIndex: `${key_name === selected_ele_name  ? 99 : 1}`
                }}    
            >
                <div 
                    className={`o_shift_grab_box ${element_names}_o_shift_grab_box`}
                    onMouseDown={()=>{element_clicked("down", key_name, index)}} 
                    onMouseUp={()=>{pos_track.current && element_clicked("up","", index )}}
                    onMouseOut={()=>{pos_track.current && element_clicked("out", "", index)}}     
                >
                    O
                </div>
                    {item[item_name_key!]}
                
            </figure>
        )
    }

    function new_input(){
        const new_input_object = {
            
        }
        return(
            <div></div>
        )
    }

    useEffect(() =>{
      set_table_data(initial_table_data);
    },[initial_table_data]);

    useEffect(() =>{
      send_form_data(table_data)
    },[table_data]);

  return (
    <figure id={`${element_names}_o_shift_box`} className="o_shift_box">
        {table_data && table_data.map(create_inputs)}
        {submit_method === "add" && new_input()}
    </figure>
  )
}
