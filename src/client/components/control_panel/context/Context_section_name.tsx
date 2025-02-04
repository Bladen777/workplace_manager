import { createContext,  ReactNode, useState } from "react"

// STYLE IMPORTS
import { log_colors } from "../../../styles/_log_colors.js";

// TYPE DEFINITIONS

interface Types_context{
    update_func:Function,
    show_context:string
}

// The Value to use
export const Use_Context_Section_Name = createContext<Types_context>({update_func:()=>{},show_context:""});

// The Component returned 
export function Provide_Context_Section_Name({children}:{children:ReactNode}) {
  
    const [section_name, set_section_name] = useState<string>("")

    function change_section_name(value:string){
      console.log(`%c CONTEXT UPDATE `, `background-color:${log_colors.context}`, `section_name changed to ${value}`);
      set_section_name(value);
    }

  return (
    <Use_Context_Section_Name.Provider value={{update_func:change_section_name, show_context:section_name }}>
        {children}
    </Use_Context_Section_Name.Provider>
  )
}