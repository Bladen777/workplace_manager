import axios from "axios";
import { populate } from "dotenv";
import { useEffect, useState } from "react"



// TYPE DEFINITIONS
export interface Types_client{
  client_name: string,
  client_address: string,
  client_date: string,
  }

  interface Types_client_import extends Types_client{
    id:number
  }


export default function Client_view() {

  const [clients, set_clients] = useState<Types_client_import[]>([]);

  async function get_clients(){
    try {
      const response = await axios.get("/get_clients");
      const client_data = response.data;

      console.log("the client_data: ", client_data);
      set_clients(client_data);

  } catch (error) {
    console.log('%cError fetching clients', 'background-color:red',error);
  }
  } 

  function populate_view(item: Types_client_import, index:number){
    console.log("the current item", item);
      return(
        <figure className={index % 2 === 0 ? "cpv_entry" : "cpv_entry cpv_entry_odd" } key={item.id}>
          <h3 className="cpv_entry_title">{item.client_name}</h3>
          <div className="cpv_item_box">
            <p className="cpv_item">{item.client_address}</p>
            <p className="cpv_item">{item.client_date}</p>
          </div>
        </figure>
      )
    }
  

  useEffect(()=>{
    get_clients();
  },[])

  return (

        <div>{clients.map(populate_view)}</div>


  )
}
