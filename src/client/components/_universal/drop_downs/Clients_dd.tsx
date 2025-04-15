import { useEffect, useState } from "react";
import axios from "axios";

// COMPONENT IMPORTS 
import Input_drop_down from "./Input_drop_down.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS
import { Types_search_item } from "./Input_drop_down.js";

// THE COMPONENT 
export default function Clients_dd({send_table_data}:{send_table_data:Function}) {
    console.log(`   %c SUB_COMPONENT `, `background-color:${ log_colors.sub_component }`, `clients_dd`);

    const [client_list, set_client_list] = useState<string[]>([])

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

// MEMOS AND EFFECTS
    useEffect(() =>{
      fetch_client_list()
    },[])


// RETURNED VALUES 
    return(
        <label className="form_dd auto_form_input">
            <p>Client:</p>
            <Input_drop_down
                table_name={{main:"Client"}}
                string_table_data={client_list}
                send_table_data={(
                    {input_value}:{input_value:Types_search_item})=>
                        send_table_data({input:input_value.name, db_column:"client_name"}
                )}
            />
        </label>
    ); 
}