import axios from "axios"
import { useState } from "react"

import { Types_client } from "../control_panel_views/Client_view.js";

export default function Client_edit() {

  const [client_info, set_client_info] = useState<Types_client>({
    client_name:"",
    client_address:"",
    client_date:""
  });

  const [success_message, set_success_message] = useState<string>("");

  async function post_form(method:string){
    console.log("the values being sent: ", 
      client_info.client_name, ", ", 
      client_info.client_address, ", ", 
      client_info.client_date );
    
    try {
      await axios.post("/client_edit", {
        method: method,
        name: client_info.client_name,
        address: client_info.client_address,
        date: client_info.client_date
      },{ headers: {
        'Content-Type': 'application/json',
      }})

      set_success_message(`${client_info.client_name} successfully ${method}ed`);

    } catch (error) {
      console.log('%cError posting client edits: ', 'background-color:red',error);   
    }
    
  }

  return (
    <div id="client_edit">
       Client_edit
      <form id="client_edit_form" >
        <input  type="text" name="client_name" id="client_name" placeholder="Name" 
                value={client_info.client_name} 
                onChange={(e)=>{set_client_info({...client_info, client_name: e.target.value})}}
        />
        <input  type="text" name="client_address" id="client_address" placeholder="Address" 
                value={client_info.client_address} 
                onChange={(e)=>{set_client_info({...client_info, client_address: e.target.value})}}
        />
        <input  type="date" name="client_date" id="client_date" 
                onChange={(e)=>{set_client_info({...client_info, client_date: e.target.value})}}
        />
        <button id="client_edit_done" type="button" onClick={()=>{post_form("add")}}> Done </button>
      </form>

      {success_message !== "" && 
        <div id="success_message">
          <h2>{success_message}</h2>
        </div>
      }

    </div>
  )
};
