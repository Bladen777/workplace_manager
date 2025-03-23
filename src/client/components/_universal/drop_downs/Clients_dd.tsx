import { ReactElement, useEffect, useMemo, useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
import "../../../styles/_universal/form_dd.css"

// LOG STYLE 
import { log_colors } from "../../../styles/_log_colors.js";



// TYPE DEFINITIONS

// THE COMPONENT 
export default function Clients_dd({send_table_data}:{send_table_data:Function}) {
    console.log(`%c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `clients_dd`);

    const [client, set_client] = useState<string>("");
    const [client_list, set_client_list] = useState<string[]>([])
    const [matched_clients, set_matched_clients] = useState<ReactElement[]>([]);
    const [open_dd, set_open_dd] = useState<boolean>(false)

    // GET CURRENT LIST OF CLIENT NAMES
    async function fetch_client_list(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "clients",
                sort_field: "name"

            })
            const client_names = response.data.map((item:{name:string})=>item.name)
            console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for client_names`,'\n' ,client_names);
            set_client_list(client_names)
        
        } catch (error){
          console.log(`%c  has the following error: `, 'background-color:darkred', error); 
        };
    }

    function handle_input_change({value}:{value:string}){
        if(value === "" || value === undefined){
            send_table_data({input: "", db_column:"client_name"})
            set_open_dd(false)
        }else{
            set_open_dd(true)
        }
        set_client(value)
    }

    useMemo(()=>{
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for client_list`,'\n' ,client_list);
        const searched_clients: string[] = [];
        client_list.forEach((item:string)=>{
            const search_client_name = client.toLowerCase();
            const client_name:string = item.toLowerCase();
            if(client_name.includes(search_client_name)){
                searched_clients.push(item)
            }
        });

        if(searched_clients.length > 0){
            const new_list:ReactElement[] = searched_clients.map((item:string, index:number)=>{
                return(
                    <button
                        key={`dd_input_${index}`}
                        type="button"
                        className="form_dd_list_btn"
                        onClick={()=>{
                            set_client(item)
                            set_open_dd(false)
                            send_table_data({input: item, db_column:"client_name"})
                        }}
                    >
                        {item}
                    </button>
                )
            })
            set_matched_clients(new_list)
        } else {
            const blank_input = (
                <p 
                key={`dd_blank`}
                className="form_dd_blank_input"
                > 
                    Client does not Exist
                </p>
            )
            send_table_data({input: "", db_column:"client_name"})
            set_matched_clients([blank_input])
        }

        
    },[client, client_list])

    useEffect(() =>{
      fetch_client_list()
    },[])

    // RETURNED VALUES 
    return(
        <label className="form_dd">
            <p>Client:</p>
            <input
                className="form_dd_input"
                value={client}
                placeholder="Client"
                type="text"
                onClick={()=>{set_open_dd(true)}}
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                    let value:string = e.target.value;
                    handle_input_change({value:value})
                }}

            />
            <div 
                className={`${open_dd ? "form_dd_list_open" : "form_dd_list_close"} form_dd_list`}
            >
              {matched_clients}  
            </div>

        </label>
    ); 
}