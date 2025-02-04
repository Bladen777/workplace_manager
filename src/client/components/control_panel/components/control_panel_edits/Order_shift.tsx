import { useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS
import Control_panel_entries from "../Control_panel_entries.js";
import Edit_control_panel_entry from "./Edit_control_panel_entry.js";


// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../../context/Context_section_name.js";

// LOG STYLES
import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data } from "../../context/Context_db_table_info.js";
import { Use_Context_Table_Data } from "../../context/Context_get_table_data.js";

interface Types_props{
    ele_names: string;
    send_table_data: Function;
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




// THE COMPONENT
export default function Order_shift({ele_names, send_table_data, submit_method}:Types_props) {

    const section_name = useContext(Use_Context_Section_Name).show_context;
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`,`for Order_shift`);

    const initial_table_data = useContext(Use_Context_Table_Data).show_context;

    const [new_table_data, set_new_table_data] = useState<Types_form_data[]>(initial_table_data);
    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for table_data`,'\n' ,initial_table_data);
    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for new_table_data`,'\n' ,new_table_data);

    const current_ele_div_ref = useRef<HTMLDivElement | null>(null);
    
    const pos_track = useRef<boolean>(false);
    const [selected_ele_name, set_selected_ele_name] = useState<string>("");
    const selected_ele_pos = useRef<Types_selected_ele_pos>({start:0, adjust:0})
    const shift_ele_direction = useRef<string>("")
    const start_pos = useRef<Types_pos>({x:0, y:0});

    const [ele_pos, set_ele_pos] = useState<Types_pos>({x:0, y:0}); 
    const mouse_x= useRef<number>();
    const mouse_y = useRef<number>();

 
    // Check if order element was clicked or unclicked
    function ele_clicked(method:string, key_name:string, index:number){
        if(method === "down"){
            start_pos.current = {x: mouse_x.current!, y: mouse_y.current!}
            pos_track.current = true;
            selected_ele_pos.current = {start: index , adjust: index};
            set_selected_ele_name(key_name);
        }else {
            pos_track.current = false;
            shift_ele_direction.current = "";
            set_ele_pos({x:0, y:0});
            set_selected_ele_name("");
            set_new_table_data(adjust_table_data(index));
        }
    }


    // Adjust the table data based on the position of the current elements
    function adjust_table_data(index:number){
        const temp_table_data:Types_form_data[] = [...new_table_data];
        temp_table_data.splice(selected_ele_pos.current.start, 1);
        temp_table_data.splice(selected_ele_pos.current.adjust, 0, new_table_data[index]);
        temp_table_data.map((item, index)=>{
            const item_order_key:string | undefined = (Object.keys(item)).find((key_name: string) => {
                if(key_name.includes("order")){
                    return key_name;
                } 
            });
            item[item_order_key!] =`${index + 1}`;
        })
        console.log(`%ctemp_table_data: `, 'background-color:olive',temp_table_data );
        return temp_table_data;
    }

    // Track the position of clicked element and adjust the position of other elements
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
                if (move_y > ele_size && selected_ele_pos.current.adjust < new_table_data.length){
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
                console.log("the Size of the ele: ", current_ele_height);
                console.log("the Size of the ele margin: ", ele_margin);
                console.log(`%c selected_ele_name:  `, 'background-color:olive', selected_ele_name); 
                console.log(`%c Move ele up`, 'background-color:blue', selected_ele_pos.current);
                console.log(`%c Shift is: `, 'background-color:darkblue', shift_ele_direction.current );
            }  
            check_to_shift();
            set_ele_pos({x: move_x, y: move_y});
        }
    }

    // Create the elements to be displayed
    function create_inputs(item:Types_form_data, index:number){
        let key_name = `dep_ele_${index}`
        const row = index + 1;

        return(
            <figure
                ref={key_name === selected_ele_name ? current_ele_div_ref : undefined }
                key={key_name}
                className={`o_shift_ele ${ele_names}_o_shift_ele`}
                onMouseMove={(e)=>{track_mouse(e)}}

                style={{
                    transform: `translate(${
                        key_name === selected_ele_name ? 
                        `${ele_pos.x}px , ${ele_pos.y}px`:
                        `0px , 0px`
                    })`,
                    gridRow: `${
                        // ele above adjustments
                        shift_ele_direction.current === "up" && index < selected_ele_pos.current.start && index >= selected_ele_pos.current.adjust 
                        ? row + 1 
                        : 
                        // ele below adjustments
                        shift_ele_direction.current === "down" && index > selected_ele_pos.current.start && index <= selected_ele_pos.current.adjust 
                        ? row - 1 
                        : 
                        // target ele adjustments
                        key_name === selected_ele_name 
                        ? selected_ele_pos.current.adjust + 1 
                        : 
                        row
                    }`,
                    zIndex: `${key_name === selected_ele_name  ? 99 : 1}`
                }}    
            >
                <button 
                    className={`o_shift_grab_box ${ele_names}_o_shift_grab_box`}
                    onMouseDown={()=>{ele_clicked("down", key_name, index)}} 
                    onMouseUp={()=>{pos_track.current && ele_clicked("up","", index )}}
                    onMouseOut={()=>{pos_track.current && ele_clicked("out", "", index)}}     
                >
                    O
                </button>
                <Edit_control_panel_entry 
                    table_data={new_table_data[index]}
                    send_table_data={send_table_data}
                />

            </figure>
        )
    }


    return (
        <>
            {new_table_data && new_table_data.map(create_inputs)}
        </>
    )
}
