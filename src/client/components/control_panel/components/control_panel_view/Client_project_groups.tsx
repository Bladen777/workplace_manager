import { useEffect, useState } from "react";
import axios from "axios";

// STYLE IMPORTS
    /* LOGS */ 
import { log_colors } from "../../../../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS
import { Types_form_data } from "../../../context/Context_initial_data.js";

interface Types_props{
    client_id:number;
}

// THE COMPONENT 
export default function Client_project_groups({client_id}:Types_props) {
    console.log(`       %c SUB_COMPONENT `, `${ log_colors.sub_component }`, `Client_project_groups`);

    const [client_project_groups, set_client_project_groups] = useState<Types_form_data[]>([])

    async function fetch_client_project_groups(){
        try{
            const response = await axios.post("/get_table_info",{
                table_name: "project_groups",
                filter_key: "client_id",
                filter_item: client_id,
                order_key: "date_added",
                order_direction: "desc"
            })

            set_client_project_groups(response.data);
            
        } catch (error){
          console.log(`%c  has the following error: `, 'darkred', error); 
        };

    }

// MEMOS AND EFFECTS
    useEffect(() =>{
          fetch_client_project_groups()
    },[])

// RETURNED VALUES 
if(client_project_groups.length > 0){
        return(
            <div className="client_project_groups_view_box">
            <h4>Client Project Groups</h4>
            {client_project_groups.map((project_group)=>{
                 return(
                    <div 
                        className="client_project_group_view_box" 
                        key={`client_project_group_view_for_${project_group.name}`}   
                    >
                        <p>{project_group.name}</p>
                    </div>
                )
            })}
        </div>  
    ); 
}

}