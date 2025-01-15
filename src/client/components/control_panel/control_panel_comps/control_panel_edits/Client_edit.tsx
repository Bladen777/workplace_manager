import axios from "axios"
import { useState } from "react"

export default function Client_edit() {

  const [client_name, set_client_name]= useState<string>("");
  const [client_address, set_client_address] = useState<string>("");
  const [client_date, set_client_date] = useState("");



  async function post_form(){
    console.log("the values being sent: ", client_name, ", ", client_address, ", ", client_date );
    try {
      await axios.post("/client_edit", {
        name: client_name,
        address: client_address,
        date: client_date
      },{ headers: {
        'Content-Type': 'application/json', // Ensure the request is being sent with JSON content
      }})
    } catch (error) {
      console.log('%cError posting client edits: ', 'background-color:red',error);   
    }
    
  }

  return (
    <div id="client_edit">
       Client_edit
      <form id="client_edit_form" >
        <input  type="text" name="client_name" id="client_name" placeholder="Name" 
                value={client_name} onChange={(e)=>{set_client_name(e.target.value)}}
        />
        <input  type="text" name="client_address" id="client_address" placeholder="Address" 
                value={client_address} onChange={(e)=>{set_client_address(e.target.value)}}
        />
        <input  type="date" name="client_date" id="client_date" 
                onChange={(e)=>{set_client_date(e.target.value)}}
        />
        <button id="client_edit_done" type="button" onClick={post_form}> Done </button>
      </form>

    </div>
  )
};
