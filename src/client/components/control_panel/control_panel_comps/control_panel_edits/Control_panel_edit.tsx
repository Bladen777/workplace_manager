import axios from "axios";
import { useEffect, useState } from "react";

// TYPE DEFINITIONS 
import { Prop_types_control_panel_edit as Prop_types} from "../../Control_panel.js"

interface Types_column_name{
    column_name: string;
};

interface Types_form_data{
    [key:string]: string;
}


// THE COMPONENT
export default function Control_panel_edit({submit_method, item_id, section_name}:Prop_types) {

    const [column_names, set_column_names] = useState<Types_column_name[]>([]);
    const [form_data, set_form_data] = useState<Types_form_data>({});




    async function get_db_columns() {
        try {
            let response = await axios.post("/get_columns",{
                table_name: section_name
            })
            set_column_names(response.data);

            // set initial_form_data
            response.data.map((item:Types_column_name, index:number) => {
                const item_name:string = item.column_name;
                console.log("the current item: ", item_name)
                form_data[item_name] = "";  
            });
        } catch (error) {
            console.log('%cError getting db columns: ', 'background-color:red',error);   
        }
    }


    function create_inputs(item: Types_column_name, index:number) {
        const item_name:string = item.column_name;
        const item_string = item_name.replace("_"," ");

        let input_type;
        if(item_name.includes("date")){
            input_type = "date"
        } else if (item_name.includes("admin")) {
            input_type = "checkbox"
        } else {
            input_type = "text"
        } 

        return(
            <div className="cpe_form_input"  key={index}>
                <p>{item_string}</p>
                <input
                type={input_type}
                placeholder={item_string}
                value={form_data[item_name]}
                onChange={(e)=>{
                    set_form_data({...form_data, [item_name]: e.target.value})
                  
                }}
                />
            </div>
        )
    }



    async function get_form_info(){
        try {
            const response = await axios.post("/get_form_info",{
                table_name: section_name,
                id: item_id
            })
            const data = response.data[0];
            console.log("the existing data: ", data);

            column_names.map(() => {

            })
            
        } catch (error) {
            console.log('%cError getting existing info: ', 'background-color:red',error); 
        }
    }

    async function post_form(){
        console.log("the form_data: ", form_data)
        try {
            const response = await axios.post("/edit_form_data",{
                submit_method: submit_method,
                table_name: section_name, 
                column_names: column_names, 
                submit_data: form_data
            })
            console.log("The success_message: ",response.data)

            
        } catch (error) {
            console.log('%cError posting info to database: ', 'background-color:red',error); 

        }

    }



    useEffect(()=>{
        get_db_columns()
        if(submit_method !== "add"){
            get_form_info();
          }
    },[])

    return (
        <figure>
            <form id="cpe_form">
            {column_names.map(create_inputs)}
            <button id="client_edit_done" type="button" className="control_panel_btn" onClick={()=>{post_form()}}> Done </button>

            </form>
            
        </figure>
    )
}
