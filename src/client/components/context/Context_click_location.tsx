
import { createContext, ReactNode, useContext, useState } from "react"


// TYPE DEFINITIONS

interface Types_context{
    update_func:Function,
    show_context:string
}

interface Types_clicks{
    id:string;
    class:string;
}


// The Value to use
export const Use_Context_Click_Location = createContext<Types_context>({update_func:()=>{},show_context:""});

// The Component returned 
export function Provide_Context_Click_Location({children}:{children:ReactNode}) {

    // Get the click locations
document.body.addEventListener("click",(e)=>{
    let clicked  = e.target;
    const screen_pos = {
        x: e.screenX, 
        y: e.screenY
    }


    console.log("the click event: ", clicked);
    console.log("the screen_pos: ", screen_pos.x , ", ", screen_pos.y);
})

    const [section_name, set_section_name] = useState<string>("")
    //const new_table_data = useContext(Use_Context_Table_Info).update_func;

    function change_section_name(value:string){
      console.log(`%cSection name update called for: `, 'background-color:blue',value );
            //new_table_data(value);
            set_section_name(value);
    }

  return (
    <Use_Context_Click_Location.Provider value={{update_func:change_section_name, show_context:section_name }}>
        {children}
    </Use_Context_Click_Location.Provider>
  )
}