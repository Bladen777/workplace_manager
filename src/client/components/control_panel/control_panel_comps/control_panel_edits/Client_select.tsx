import axios from "axios";


export default function Client_select(section_name:string) {


        // GET THE INFOMATION FOR SETTING A RANGE INPUT 
        async function get_table_range(item_name:string){
            try {
                const response = await axios.post("/get_table_info", {
                    table_name: section_name,
                    sort_field: item_name
                    }
                )
                const data:number = response.data.length + 1;
                console.log("the table range: ", data)
                return data
            } catch (error) {
                console.log('%cError getting table range: ', 'background-color:darkred',error);
            }  
        }
  return (
    <div>Client_select</div>
  )
}
