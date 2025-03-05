import { ReactElement, useContext, useEffect, useRef, useState } from "react";

// COMPONENT IMPORTS
import Form_auto_input from "../../../_universal/inputs/Form_auto_input.js";

// CONTEXT IMPORTS
import { Use_Context_Table_Info } from "../../context/Context_db_table_info.js";
import { Use_Context_Table_Data } from "../../context/Context_get_table_data.js";

// STYLE IMPORTS
import "../../../../styles/control_panel/cp_order_shift.css"

// LOG STYLES
import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_form_data} from "../../context/Context_db_table_info.js";
import { Types_input_change } from "../../../_universal/inputs/Form_auto_input.js";


interface Prop_Types{
    ele_names:String;
    send_table_data: Function;
    submit_method: string;
}

interface Types_pos{
    size?: number;
    x: number;
    y: number;
}

interface Types_shift_ele_row{
    start: number;
    adjust: number;
    direction: string;
}

interface Types_change_input_data extends Types_input_change{
    id:number;
}


// THE COMPONENT
export default function Order_shift({ele_names, send_table_data, submit_method}:Prop_Types) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`,`for Order_shift`);

    // CONSTANTS FOR TRACKING DATA
    const db_column_info = useContext(Use_Context_Table_Info).show_context.db_column_info;
    const initial_form_data = useContext(Use_Context_Table_Info).show_context.initial_form_data;
    const initial_table_data = useContext(Use_Context_Table_Data).show_context;
    const [table_data, set_table_data] = useState<Types_form_data[]>(initial_table_data);
    const table_data_ref = useRef<Types_form_data[]>(initial_table_data)
    const [entry_data, set_entry_data] = useState<ReactElement[]>([]);

    // CONSTANTS FOR TRACKING POSITION
    const [selected_ele_name, set_selected_ele_name] = useState<string>("");
    const current_ele_div_ref = useRef<HTMLDivElement | null>(null);
    const grab_box_ref = useRef<HTMLButtonElement | null>(null);
    const pos_track = useRef<boolean>(false);
    const start_pos = useRef<Types_pos>({size:0, x:0, y:0});
    const shift_ele_row = useRef<Types_shift_ele_row>({start:0, adjust:0, direction:""})
  
    // CONSTANTS THAT CONTROL POSITIONS
    const entry_indexes = useRef<number[]>([]);
    const [ele_pos, set_ele_pos] = useState<Types_pos>({x:0, y:0}); 


    // CHECK IF ORDER ELEMENT WAS CLICKED OR UNCLICKED
    function handle_ele_click(method:string, key_name:string, index:number){
        if(method === "down"){
            console.log(`%c CLICKED `, `background-color:${ log_colors.important }`);
            pos_track.current = true;
            shift_ele_row.current = {start: index , adjust: index, direction:""};
            set_selected_ele_name(key_name);

        }else {
            console.log(`%c UNCLICKED `, `background-color:${ log_colors.important }`);
            pos_track.current = false;
            start_pos.current = {x:0 , y:0};
            set_ele_pos({x:0, y:0});
            set_selected_ele_name("");
            adjust_table_data(index);
            shift_ele_row.current.direction = "";
            send_table_data(table_data_ref.current);
        }
    }

    // TRACK THE POSITION OF CLICKED ELEMENT AND ADJUST THE POSITION OF OTHER ELEMENTS
    function handle_mouse_move(event:React.MouseEvent){
        const mouse_pos:Types_pos ={ x:event.clientX, y:event.clientY};

            // FIND AND ADJUST STARTING GRAB POSITION
            if(start_pos.current.x === 0){
                const grab_box_size = grab_box_ref.current!.getBoundingClientRect();
                start_pos.current = {x: (grab_box_size.x + (grab_box_size.width/2)), y: (grab_box_size.y + (grab_box_size.height/2))}

                // FIND AND ADJUST ELEMENT SIZES TO TRACK 
                const current_ele_height:number = current_ele_div_ref.current!.offsetHeight;
                const ele_margin:number = Number(window.getComputedStyle(current_ele_div_ref.current!).getPropertyValue('margin-top').replace(/[^0-9]/g , ''));
                start_pos.current.size = current_ele_height + ele_margin*2;
            }
    
            // DEFINE VARIABLES TO CONTAIN THE AMOUNT TO SHIFT POSITION
            let move: Types_pos = { 
                x: mouse_pos.x - start_pos.current.x!,
                y: mouse_pos.y - start_pos.current.y!
            }

            // TRACK WHEN SHIFTING ELEMENT POSITIONS WITH OTHER ELEMENTS
            function check_to_shift(){ 
                if (move.y > start_pos.current.size! && shift_ele_row.current.adjust < table_data_ref.current.length){
                    // move index down
                    shift_ele_row.current.adjust ++ ;
                } else if (start_pos.current.size! + move.y <= 0  && shift_ele_row.current.adjust !== 0){
                    //move index up
                    shift_ele_row.current.adjust -- ;
                } else {
                    return
                };

                start_pos.current.y = mouse_pos.y;
                move.y = 0;

                if(shift_ele_row.current.adjust > shift_ele_row.current.start){
                    shift_ele_row.current.direction = "down";
                } else if (shift_ele_row.current.adjust < shift_ele_row.current.start){
                   shift_ele_row.current.direction = "up";
                } else {
                   shift_ele_row.current.direction = "";
                    return
                };
            }  

            check_to_shift();
            set_ele_pos({x: move.x, y: move.y});
    }


    // ADJUST THE TABLE DATA BASED ON THE POSITION OF THE CURRENT ELEMENTS
    function adjust_table_data(index:number){
        const temp_table_data:Types_form_data[] = [...table_data_ref.current];
        temp_table_data.splice(shift_ele_row.current.start, 1);
        temp_table_data.splice(shift_ele_row.current.adjust, 0, table_data_ref.current[index]);
        temp_table_data.map((item, index)=>{
            const item_order_key:string | undefined = (Object.keys(item)).find((key_name: string) => {
                if(key_name.includes("order")){
                    return key_name;
                } 
            });
            item[item_order_key!] = index + 1;
        })
        console.log(`%ctemp_table_data: `, 'background-color:olive',temp_table_data );
        table_data_ref.current = temp_table_data;

        // ADJUST THE POSITIONS OF THE ELEMENTS
        const temp_entry_indexes: number[] = [...entry_indexes.current];
        const entry_value:{index:number, old:number, new:number} = {
            index: temp_entry_indexes.findIndex((item)=>{return item === shift_ele_row.current.start}),
            old: shift_ele_row.current.start,
            new: shift_ele_row.current.adjust
        };

        const new_entry_indexes = temp_entry_indexes.map((item:number, index:number)=>{
            if(index === entry_value.index ){
                return entry_value.new
            } else if( 
               shift_ele_row.current.direction === "up" && (
                    (item > entry_value.new && item < entry_value.old) || 
                    (item === entry_value.new && index !== entry_value.index)
            )){
                return item + 1;
            } else if (
               shift_ele_row.current.direction === "down" && (
                    (item < entry_value.new && item > entry_value.old) || 
                    (item === entry_value.new && index !== entry_value.index)
            )){
                return item - 1;
            } else{
                return item;
            };
        });

        entry_indexes.current = new_entry_indexes;
    }

 
    // SEND DATA TO PARENT, AND UPDATE CURRENT TABLE DATA FROM THE CHILD COMPONENT
    function change_table_data(form_data:Types_change_input_data){
        const changed_entry_index = table_data.findIndex((item)=>{
            return item.id === form_data.id;
        })
        const update_form_data = {...table_data_ref.current[changed_entry_index], [form_data.db_column]:form_data.input};

        const temp_table_data:Types_form_data[] = [...table_data_ref.current];
        temp_table_data.splice(changed_entry_index, 1, update_form_data);
        table_data_ref.current = temp_table_data;
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
                }; 
            });
            const temp_form_data:Types_form_data = {...initial_form_data};
            temp_form_data[item_order_key!] = initial_table_data.length + 1;
            temp_table_data.push(temp_form_data);  
        } 

        const entries:ReactElement[] = temp_table_data.map((item, index:number)=>{
            entry_indexes.current.push(index);
            return(
                <form className="auto_form o_shift_form">
                    {db_column_info.map((column)=>{
                        return(
                            <Form_auto_input 
                                key={`input_for_${column.column_name}`}
                                column_info={column}
                                table_data_object={item}
                                send_table_data={(input:Types_input_change)=>{
                                    change_table_data({
                                        input:input.input, 
                                        db_column:input.db_column,
                                        id:item.id!
                                    })
                                }}
                            />
                        )
                    })}
                </form>
            );
        });

        table_data_ref.current = temp_table_data;
        set_table_data(temp_table_data);
        set_entry_data(entries);
    },[]);
  

    // CREATE THE ELEMENTS TO BE DISPLAYED
    function create_inputs(){
        const inputs = table_data.map((item:Types_form_data, index:number)=>{
            let key_name = `order_ele_${index}`
            const index_adjust = entry_indexes.current[index]
            const row =  index_adjust + 1;

            return(
                <figure
                    ref={key_name === selected_ele_name ? current_ele_div_ref : undefined }
                    key={key_name}
                    className={submit_method === "add" && index === table_data.length - 1 ? `o_shift_ele new_o_shift_entry ${ele_names}_o_shift_ele`  : `o_shift_ele ${ele_names}_o_shift_ele`}
                    id={row.toString()}
                    onMouseMove={(e: React.MouseEvent)=>{pos_track.current && handle_mouse_move(e)}}

                    style={{
                        transform: `translate(${
                            key_name === selected_ele_name ? 
                            `${ele_pos.x}px , ${ele_pos.y}px`:
                            `0px , 0px`
                        })`,
                        gridRow: `${
                            // ELE ABOVE ADJUSTMENTS
                           shift_ele_row.current.direction === "up" && index_adjust < shift_ele_row.current.start && index_adjust >= shift_ele_row.current.adjust 
                            ? row + 1 
                            : 
                            // ELE BELOW ADJUSTMENTS
                           shift_ele_row.current.direction === "down" && index_adjust > shift_ele_row.current.start && index_adjust <= shift_ele_row.current.adjust 
                            ? row - 1 
                            : 
                            // TARGET ELE ADJUSTMENTS
                            key_name === selected_ele_name 
                            ? shift_ele_row.current.adjust + 1 
                            : 
                            row
                        }`,
                        zIndex: `${key_name === selected_ele_name  ? 99 : 1}`
                    }}    
                >
                    <button
                        ref={key_name === selected_ele_name ? grab_box_ref : undefined }
                        className={`o_shift_grab_box ${ele_names}_o_shift_grab_box`}
                        onMouseDown={()=>{handle_ele_click("down", key_name, index_adjust)}} 
                        onMouseUp={()=>{pos_track.current && handle_ele_click("up","", index_adjust )}}
                        onMouseOut={()=>{pos_track.current && handle_ele_click("out", "", index_adjust)}}     
                    >
                        <p>☰</p>
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
