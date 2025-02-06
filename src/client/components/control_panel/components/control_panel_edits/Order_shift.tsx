import { ReactElement, useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS
import Control_panel_entries from "../Control_panel_entries.js";
import Edit_control_panel_entry from "./Edit_control_panel_entry.js";


// CONTEXT IMPORTS
import { Use_Context_Section_Name } from "../../context/Context_section_name.js";
import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";

// LOG STYLES
import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data} from "../../context/Context_db_table_info.js";
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

    // CONSTANTS FOR TRACKING DATA
    const initial_form_data = useContext(Use_Context_Table_Info).show_context.initial_form_data;
    const initial_table_data = useContext(Use_Context_Table_Data).show_context;
    const [table_data, set_table_data] = useState<Types_form_data[]>(initial_table_data);
    const current_table_data = useRef<Types_form_data[]>(initial_table_data)
    const [entry_data, set_entry_data] = useState<ReactElement[]>([]);
    const entry_indexes = useRef<number[]>([]);

    // CONSTANTS FOR TRACKING POSITION
    const current_ele_div_ref = useRef<HTMLDivElement | null>(null);
    const pos_track = useRef<boolean>(false);
    const [selected_ele_name, set_selected_ele_name] = useState<string>("");
    const selected_ele_pos = useRef<Types_selected_ele_pos>({start:0, adjust:0})
    const shift_ele_direction = useRef<string>("")
    const start_pos = useRef<Types_pos>({x:0, y:0});

    const [ele_pos, set_ele_pos] = useState<Types_pos>({x:0, y:0}); 
    const mouse_x= useRef<number>();
    const mouse_y = useRef<number>();

 
    // CHECK IF ORDER ELEMENT WAS CLICKED OR UNCLICKED
    function ele_clicked(method:string, key_name:string, index:number){
        if(method === "down"){
            start_pos.current = {x: mouse_x.current!, y: mouse_y.current!}
            pos_track.current = true;
            selected_ele_pos.current = {start: index , adjust: index};
            set_selected_ele_name(key_name);
        }else {
            pos_track.current = false;
            set_ele_pos({x:0, y:0});
            set_selected_ele_name("");
            adjust_table_data(index);
            shift_ele_direction.current = "";
            //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for current_table_data.current`,'\n' ,current_table_data.current);
            //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for entry_data`,'\n' ,entry_data.map((item)=>item?.props?.table_data));

            send_table_data(current_table_data.current);
        }
    }

    // TRACK THE POSITION OF CLICKED ELEMENT AND ADJUST THE POSITION OF OTHER ELEMENTS
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
                if (move_y > ele_size && selected_ele_pos.current.adjust < current_table_data.current.length){
                    // move index down
                    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for selected_ele_name`,'\n' ,selected_ele_name, "down");
                    selected_ele_pos.current.adjust ++ ;
                } else if (ele_size + move_y <= 0  && selected_ele_pos.current.adjust !== 0){
                    //move index up
                    console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for selected_ele_name`,'\n' ,selected_ele_name, "up");
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
            }  
            check_to_shift();
            set_ele_pos({x: move_x, y: move_y});
        }
    }


    // ADJUST THE TABLE DATA BASED ON THE POSITION OF THE CURRENT ELEMENTS
    function adjust_table_data(index:number){
        const temp_table_data:Types_form_data[] = [...current_table_data.current];
        temp_table_data.splice(selected_ele_pos.current.start, 1);
        temp_table_data.splice(selected_ele_pos.current.adjust, 0, current_table_data.current[index]);
        temp_table_data.map((item, index)=>{
            const item_order_key:string | undefined = (Object.keys(item)).find((key_name: string) => {
                if(key_name.includes("order")){
                    return key_name;
                } 
            });
            item[item_order_key!] =`${index + 1}`;
        })
        console.log(`%ctemp_table_data: `, 'background-color:olive',temp_table_data );
        current_table_data.current = temp_table_data;

        

        // ADJUST THE POSITIONS OF THE ELEMENTS
        const temp_entry_indexes: number[] = [...entry_indexes.current];
        const entry_value:{index:number, old:number, new:number} = {
            index: temp_entry_indexes.findIndex((item)=>{return item === selected_ele_pos.current.start}),
            old: selected_ele_pos.current.start,
            new: selected_ele_pos.current.adjust
        }

        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for shift_ele_direction.current`,'\n' ,shift_ele_direction.current);
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for entry_value`,'\n' ,entry_value);

        const new_entry_indexes = temp_entry_indexes.map((item:number, index:number)=>{
            if(index === entry_value.index ){
                return entry_value.new
            } else if( 
                shift_ele_direction.current === "up" && (
                    (item > entry_value.new && item < entry_value.old) || 
                    (item === entry_value.new && index !== entry_value.index)
            )){
                return item + 1;
            } else if (
                shift_ele_direction.current === "down" && (
                    (item < entry_value.new && item > entry_value.old) || 
                    (item === entry_value.new && index !== entry_value.index)
            )){
                return item - 1;
            } else{
                return item;
            };
        });

        const past_entry_pairs = {
            depo_1: entry_indexes.current[0],
            depo_3: entry_indexes.current[1],
            depo_2: entry_indexes.current[2],
            silly: entry_indexes.current[3],
        }
        const new_entry_pairs = {
            depo_1: new_entry_indexes[0],
            depo_3: new_entry_indexes[1],
            depo_2: new_entry_indexes[2],
            silly: new_entry_indexes[3],
        }

        console.log(`%c PAST INDEXES `, `background-color:${ log_colors.data }`,'\n' ,past_entry_pairs);
        console.log(`%c NEW INDEXES `, `background-color:${ log_colors.data }`,'\n' ,new_entry_pairs);
        entry_indexes.current = new_entry_indexes;
    }

 


    
    // SEND DATA TO PARENT, AND UPDATE CURRENT TABLE DATA FROM THE CHILD COMPONENT
    function change_table_data(value:Types_form_data){
        const changed_entry_index = table_data.findIndex((item)=>{
            return item.id === value.id;
        })

        const temp_table_data:Types_form_data[] = [...current_table_data.current];
        temp_table_data.splice(changed_entry_index, 1, value);
        current_table_data.current = temp_table_data;
        send_table_data(temp_table_data);
    }

    // SET THE INITIAL DATA VALUES
    useEffect(() =>{
        console.log(`%c ENTRY ELEMENTS SET `, `background-color:${ log_colors.important} `);
        let temp_table_data:Types_form_data[] = [...initial_table_data];
        if(submit_method === "add"){
            const item_order_key:string | undefined = (Object.keys(initial_form_data)).find((key_name: string) => {
                if(key_name.includes("order")){
                    return key_name;
                } 
            });
            const temp_form_data:Types_form_data = {...initial_form_data}
            temp_form_data[item_order_key!] = initial_table_data.length + 1;
            temp_table_data.push(temp_form_data);  
        } 


        const entries:ReactElement[] = temp_table_data.map((item, index:number)=>{
            entry_indexes.current.push(index);
            return(
                <Edit_control_panel_entry 
                        table_data={item}
                        send_table_data={change_table_data}
                    />
                )
        });

        current_table_data.current = temp_table_data;
        set_table_data(temp_table_data)
        set_entry_data(entries)
    },[])
  

    // Create the elements to be displayed
    function create_inputs(){
        const inputs = table_data.map((item:Types_form_data, index:number)=>{
            let key_name = `order_ele_${index}`
            const index_adjust = entry_indexes.current[index]
            const row =  index_adjust + 1;
            //console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for selected_ele_name`,'\n' ,selected_ele_name);
            if(!pos_track.current && entry_data.length !== 0 ){
                index === 0 && console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for entry_indexes.current`,'\n' ,entry_indexes.current);
                index === 0 && console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for initial_table_data`,'\n' ,initial_table_data);
                console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for table_data`, index_adjust, row ,'\n' ,table_data[index]);
                //console.log(`%c ENTRY VALUES `, `background-color:${ log_colors.data }`,`for entry_data`,key_name ,index_adjust, row,'\n' ,entry_data[index_adjust]?.props?.table_data);
            }
            return(
                <figure
                    ref={key_name === selected_ele_name ? current_ele_div_ref : undefined }
                    key={key_name}
                    className={`o_shift_ele ${ele_names}_o_shift_ele`}
                    id={row.toString()}
                    onMouseMove={(e)=>{track_mouse(e)}}

                    style={{
                        transform: `translate(${
                            key_name === selected_ele_name ? 
                            `${ele_pos.x}px , ${ele_pos.y}px`:
                            `0px , 0px`
                        })`,
                        gridRow: `${
                            // ele above adjustments
                            shift_ele_direction.current === "up" && index_adjust < selected_ele_pos.current.start && index_adjust >= selected_ele_pos.current.adjust 
                            ? row + 1 
                            : 
                            // ele below adjustments
                            shift_ele_direction.current === "down" && index_adjust > selected_ele_pos.current.start && index_adjust <= selected_ele_pos.current.adjust 
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
                        onMouseDown={()=>{ele_clicked("down", key_name, index_adjust)}} 
                        onMouseUp={()=>{pos_track.current && ele_clicked("up","", index_adjust )}}
                        onMouseOut={()=>{pos_track.current && ele_clicked("out", "", index_adjust)}}     
                    >
                        O
                    </button>
                    {entry_data[index_adjust]}
                </figure>
            )
        })
        return inputs;
    }


    return (
        <>  
            {table_data && create_inputs()}
        </>
    )
}
