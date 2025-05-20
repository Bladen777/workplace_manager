import { useState, useRef, useEffect, useMemo, ReactElement } from "react";

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 
import useFindClickPosition from "../../hooks/useFindClickPosition.js";

// COMPONENT IMPORTS 

// TYPE DEFINITIONS
import { Types_form_data } from "../../context/Context_initial_data.js";

interface Types_props{
    placeholder?: string;
    selected_entry?:string;
    table_name: Types_table_name;
    string_table_data?: string[] 
    form_table_data?: Types_form_data[];
    send_table_data:Function;
}

interface Types_table_name{
    main: string;
    specific?:string;
}

export interface Types_search_item{
    name: string;
    id?: number;
}

// THE COMPONENT 
export default function Input_drop_down({placeholder, selected_entry, table_name, string_table_data, form_table_data, send_table_data}:Types_props) {
    console.log(`       %c INPUT DROP DOWN `, `${ log_colors.input_component }`, `for ${table_name.specific ? table_name.specific : table_name.main}`);
    //console.log(`%c DATA `, `${ log_colors.data }`,`for selected_entry`,'\n' ,selected_entry);

    let table_data: string[] | Types_form_data[] = [];
    if(string_table_data){
        table_data = string_table_data;
    } else if(form_table_data){
        table_data = form_table_data;
    }

    const [selected_item, set_selected_item] = useState<string>(selected_entry ? selected_entry : "")
    const entry_selected = useRef<boolean>(false);

    const [matched_items, set_matched_items] = useState<ReactElement[]>([])

    const [open_dd, set_open_dd] = useState<boolean>(false)
    const drop_down_ref = useRef<HTMLDivElement | null>(null);
    const input_ref = useRef<HTMLInputElement | null>(null);

    const track_click = useFindClickPosition();

    const initial_render = useRef<boolean>(true);

    function blank_input(){
        const blank_input = (
            <p 
            key={`dd_blank`}
            className="form_dd_blank_input"
            > 
                {table_name.main} does not Exist
            </p>
        )
        return blank_input
    }
    
    
    function handle_click_track(){
        
        open_dd && track_click({
            ele_name: table_name.specific ? table_name.specific : table_name.main,
            active: true, 
            ele_pos:drop_down_ref.current?.getBoundingClientRect(), 
            update_func:(value:boolean)=>{
                if(value){               
                    if(!entry_selected.current){
                        set_selected_item("");
                        send_table_data({input: {id:0}});
                    }
                    
                    set_open_dd(false);
                    input_ref.current!.blur();
                }
            }
        })
    }

    function handle_input_change({value}:{value:string}){
        entry_selected.current = false;
        set_selected_item(value)
    }


    function find_matched_items(){
        console.log(`       %c DATA `, `${ log_colors.data }`,`for DD Table Data`,'\n  ',table_data);
        
        const searched_items: Types_search_item[] = [];

        if(string_table_data){
            string_table_data.forEach((item:string)=>{
                const search_input = selected_item.toLowerCase();
                const search_name:string = item.toLowerCase();
                if(search_name.includes(search_input)){
                    searched_items.push({name:item})
                }
            });
        } else if(form_table_data){
            form_table_data.forEach((item:Types_form_data)=>{
                let item_name:string = "";  
                Object.keys(item).forEach((obj_name:string)=>{
                    if(obj_name.includes("name")){
                        if(typeof(item[obj_name]) === "string"){
                            item_name = item[obj_name]
                        }
                    }
                });
                const search_input = selected_item.toLowerCase();
                const search_name:string = item_name.toLowerCase();
                if(search_name.includes(search_input)){
                    searched_items.push({
                        name:item_name,
                        id:item.id
                    })
                }
            })
        }
            

        if(searched_items.length > 0){
            const new_list:ReactElement[] = searched_items.map((item:Types_search_item, index:number)=>{
                return(
                    <button
                        key={`dd_input_${index}`}
                        type="button"
                        className="form_dd_list_btn"
                        onClick={()=>{
                            entry_selected.current = true;
                            set_open_dd(false)
                            set_selected_item(item.name)
                            send_table_data({input: item})
                        }}
                    >
                        {item.name}
                    </button>
                )
            })
            set_matched_items(new_list)
        } else {
            set_matched_items([blank_input()])
        }
        
    }

// MEMOS AND EFFECTS
    useEffect(() =>{
      initial_render.current = false;
    },[])

    useMemo(()=>{
        find_matched_items()
    },[selected_item, table_data])
    
    useMemo(()=>{
        if(!initial_render.current){
            console.log(`%c FORM_TABLE_DATA CHANGED `, `${ log_colors.data }`, !selected_item);
            set_selected_item("");
        }
    },[form_table_data])

    useMemo(() =>{
        if(!initial_render.current){
            console.log(`%c OPEN_DD CHANGED `, `${ log_colors.data }`);
            handle_click_track()
        }
    },[open_dd])



// RETURNED VALUES 
    return(
        <div 
            ref={drop_down_ref}
            className="form_dd_box"
        >
            <input
                ref = {input_ref}
                className="form_dd_input"
                value={selected_item}
                placeholder={placeholder ? placeholder :`Select ${table_name.main}`}
                type="text"
                onMouseDown={()=>{set_open_dd(true)}} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                    let value:string = e.target.value;
                    handle_input_change({value:value})
                }}

            />
            <div 
                className={`${open_dd ? "form_dd_list_open" : "form_dd_list_close"} form_dd_list`}
            >
            {matched_items}  
            </div>
        </div>
    
    ); 
}   