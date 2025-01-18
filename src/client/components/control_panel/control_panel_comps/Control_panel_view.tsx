import axios from "axios";
import { useEffect, useState } from "react";

// CUSTOM HOOKS
import useDBTableColumns from "./hooks/useDBTableColumns.js";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_view as Prop_types} from "../Control_panel.js"

interface Types_column_info{
    column_name: string;
    is_nullable: string;
    input_type: string;
};


// THE COMPONENT
export default function Control_panel_view({ section_name, item_id}:Prop_types) {
    console.log('%cControl_panel_view Called', 'background-color:darkorchid',);

    const get_initial_info = useDBTableColumns(section_name);

    const [db_column_info, set_db_column_info] = useState<Types_column_info[]>([]);
    const [table_data, set_table_data] = useState<any>([]);

    // INITIAL FUNCTION TO GATHER THE DATA FROM DATABASE REQUIRED TO CREATE FORMS
    async function get_db_columns() {
        set_db_column_info(get_initial_info.db_column_info);
    }

    async function get_table_data(){
        try {
            const response = await axios.post("/get_table_info",{
                table_name: section_name,
                order_item: "id"
            })
            const data = response.data;
            console.log("the data gathered: ", data)
            set_table_data(data);

        } catch (error) {
            console.log(`%cError getting ${section_name}`, 'background-color:darkred',error);
        }
    }


    
    function populate_view(table_item:any, index:number){
        console.log("the item: ", table_item );
        let entry_name;

        const entry_item = db_column_info.map((item:Types_column_info, index) => {
            const column_name = item.column_name;
       
            if(column_name.includes("name")){
                entry_name = table_item[column_name]
            } else{
                return(<p>{table_item[column_name]}</p>)
            }
        })  

        console.log("the entry items: ", entry_item);

        return(
            <figure className={index % 2 === 0 ? "cpv_entry" : "cpv_entry cpv_entry_odd" }
                        key={index}
                        onClick={()=>{item_id(table_item.id)}}
            >
                <h3>{entry_name}</h3>
                {entry_item}
            </figure>
        ) 
      }

    
    useEffect(() => {
        get_db_columns();
    },[get_initial_info])

    useEffect(() => {
        get_table_data();
    },[db_column_info])

    return(
        <div>
            {table_data.map(populate_view)}
        </div>
    )

}