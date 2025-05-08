import { useContext, useEffect, useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 
import Input_drop_down from "./Input_drop_down.js";
import { Use_Context_initial_data } from "../../context/Context_initial_data.js";
import { Use_Context_active_entry } from "../../context/Context_active_entry.js";

// CONTEXT IMPORTS 

import { Use_Process_input_data } from "../Process_input_data.js";

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_search_item } from "./Input_drop_down.js";
import { Types_form_data } from "../../context/Context_initial_data.js";

// THE COMPONENT 
export default function Clients_dd() {
    console.log(`   %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `clients_dd`);

    const process_data = useContext(Use_Process_input_data);
    const [client_list, set_client_list] = useState<Types_form_data[]>([]);
    const initial_data = useContext(Use_Context_initial_data).show_context;
    const active_entry = useContext(Use_Context_active_entry).show_context;

    const [existing_client, set_existing_client] = useState<string>("")

    // GET CURRENT LIST OF CLIENT NAMES
    async function fetch_client_list(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "clients",
            })
            const client_names:Types_form_data[] = response.data.map((item:Types_form_data)=>{
                if(active_entry.submit_method === "edit" && item.id === initial_data["projects"].data[0].client_id){
                    set_existing_client(String(item.name!));
                }
                return item;
            })
            set_client_list(client_names)
        
        } catch (error){
          console.log(`%c  has the following error: `, 'darkred', error); 
        };
    }
    function handle_client_change({input}:{input:Types_search_item}){
        console.log(`%c DATA `, `${ log_colors.data }`,`for input`,'\n' ,input);
        process_data.update_data({table_name: "projects", form_data: {input:input.id , db_column:"client_id"}})
    }


// MEMOS AND EFFECTS
    useEffect(() =>{
      fetch_client_list()
    },[])


// RETURNED VALUES 
if(client_list.length > 0){
    return(
        <label className="form_dd auto_form_input">
            <p>Client:</p>
            <Input_drop_down
                table_name={{main:"Client"}}
                selected_entry = {existing_client}
                form_table_data={client_list}
                send_table_data={({input}:{input:Types_search_item})=>{
                        handle_client_change({input:input})
                }}
            />
        </label>
    ); 
}
}