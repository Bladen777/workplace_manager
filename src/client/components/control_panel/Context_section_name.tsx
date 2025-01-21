
import { createContext, useContext, ReactNode, useState } from "react"

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
            set_section_name(value)
    }

  return (
    <Use_Context_Section_Name.Provider value={{update_func:change_section_name, show_context:section_name }}>
        {children}
    </Use_Context_Section_Name.Provider>
  )
}