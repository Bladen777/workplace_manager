
import { createContext, ReactNode, useEffect, useRef, useState } from "react"

// LOG STYLE IMPORTS
import { log_colors } from "../../styles/_log_colors.js";

// TYPE DEFINITIONS
interface Types_props{
    active:boolean;
    ele_pos?: Types_click_ele_pos | undefined;
    update_func?: Function;
}

interface Types_click_ele_pos{
    right: number;
    left: number;
    top: number;
    bottom: number;
}

export default function useFindClickPosition() {
  console.log(`%c HOOK `, `background-color:${ log_colors.hook }`,`for Find Click Position`);  
    const is_active = useRef<boolean>(false);
  
    // function to check if the current click is on the targetted element
    function track_click({active, ele_pos, update_func}:Types_props){
        is_active.current = active;
        document.body.onclick = (e)=>{
            if(is_active.current){
                console.log(`   %c HOOK UPDATE `, `background-color:${ log_colors.hook }`,`for Click_Location`, is_active.current);
                let clicked  = e.target;
                const screen_pos = {
                    x: e.clientX, 
                    y: e.clientY
                }
                console.log(`   %c DATA `, `background-color:${ log_colors.data }`,`for track_ele_pos`,  ele_pos);
                console.log("   the screen_pos: ", screen_pos.x , ", ", screen_pos.y);

                if( screen_pos.x > ele_pos!.right || 
                    screen_pos.x < ele_pos!.left ||
                    screen_pos.y > ele_pos!.bottom ||
                    screen_pos.y < ele_pos!.top
                ){
                    console.log(`%c CLICKED OUTSIDE `, `background-color:${ log_colors.important }`);
                    update_func!(true);
                    is_active.current = false;
                } 
            };
        };
    };
    
return track_click;
}

