import axios from "axios"
import { useEffect, useState } from "react"

// TYPE DEFINITIONS
import { Types_client } from "../control_panel_views/Client_view.js";
import { Prop_types_control_panel_edit as Prop_types} from "../../Control_panel.js"

// THE COMPONENT
export default function Client_edit({submit_method, item_id}:Prop_types) {

  const [client_info, set_client_info] = useState<Types_client>({
    client_name:"",
    client_address:"",
    client_date:""
  });

  const [success_message, set_success_message] = useState<string>("");

  async function post_form(){
    console.log("the values being sent: ", 
      client_info.client_name, ", ", 
      client_info.client_address, ", ", 
      client_info.client_date );
    


    try {
      const response = await axios.post("/client_edit", {
        id: item_id,
        method: submit_method,
        name: client_info.client_name,
        address: client_info.client_address,
        date: client_info.client_date
      },{ headers: {
        'Content-Type': 'application/json',
      }})

      console.log("the success_message: ", response.data);
      set_success_message(response.data);

    } catch (error) {
      console.log('%cError posting client edits: ', 'background-color:red',error);   
    }
    
  }

  async function get_form_info(){
    try {
      const response = await axios.post("/get_specific_client", { 
        client_id: item_id
      })
      const data = response.data[0];
      console.log("The selected client info: ", data);
      console.log("The selected client_name: ", data.client_name);
      set_client_info(
        {...client_info,
          client_name: data.client_name,
          client_address: data.client_address,
          client_date: data.client_date
        }
      )
    } catch (error) {
      console.log('%cError getting client info: ', 'background-color:red',error);   
    }
    
  }

  useEffect(()=>{
    if(submit_method !== "add"){
      get_form_info();
    }

  },[])

  return (
    <div id="client_edit" className="cpe_entry_box">
       Client_edit
      <form id="client_edit_form" className="cpe_form">
        <input  type="text" name="client_name" id="client_name" className="cpe_form_input" placeholder="Name" 
                value={client_info.client_name} 
                onChange={(e)=>{set_client_info({...client_info, client_name: e.target.value})}}
        />
        <input  type="text" name="client_address" id="client_address" className="cpe_form_input" placeholder="Address" 
                value={client_info.client_address} 
                onChange={(e)=>{set_client_info({...client_info, client_address: e.target.value})}}
        />
        <input  type="date" name="client_date" id="client_date" className="cpe_form_input"
                value={client_info.client_date} 
                onChange={(e)=>{set_client_info({...client_info, client_date: e.target.value})}}
        />
        <button id="client_edit_done" type="button" className="control_panel_btn" onClick={()=>{post_form()}}> Done </button>
      </form>

      {success_message !== "" &&
        <div className="cpe_message">
          <h2>{success_message}</h2>
        </div>
      }

    </div>
  )
};
