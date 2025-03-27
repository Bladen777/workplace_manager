
import { createContext, ReactNode, useEffect, useRef, useState } from "react"

// LOG STYLE IMPORTS
import { log_colors } from "../../styles/_log_colors.js";

// TYPE DEFINITIONS
interface Types_props{
    ele_name:string;
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

    // function to check if the current click is on the targetted element
    function track_click({ele_name, active, ele_pos, update_func}:Types_props){
        let is_active = active;
        document.body.addEventListener("click", (e)=>{
            if(is_active){
                console.log(`   %c CLICK TRACK ACTIVE `, `background-color:${ log_colors.hook }`, `for ${ele_name}` );

                const screen_pos = {
                    x: e.clientX, 
                    y: e.clientY
                }
 
                console.log(`   %c DATA `, `background-color:${ log_colors.data }`,`for track_ele_pos`,  ele_pos,
                    '\n', "right", ele_pos!.right,
                    '\n', "left", ele_pos!.left,
                    '\n', "top", ele_pos!.top,
                    '\n', "bottom", ele_pos!.bottom,
                );
                console.log("   the screen_pos: ", screen_pos.x , ", ", screen_pos.y);

                if( screen_pos.x > ele_pos!.right || 
                    screen_pos.x < ele_pos!.left ||
                    screen_pos.y > ele_pos!.bottom ||
                    screen_pos.y < ele_pos!.top
                ){
                    console.log(`%c CLICKED OUTSIDE `, `background-color:${ log_colors.important }`);
                    update_func!(true);
                    is_active = false;
                } 
            };
            e.stopPropagation()
        });
        

    };
    
return track_click;
}

