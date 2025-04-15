import { useRef } from "react";

// STYLE IMPORTS
  /* LOGS */import { log_colors } from "../../styles/_log_colors.js";

// TYPE DEFINITIONS
interface Types_click_track{
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

interface Types_client_position{
    x:number;
    y:number;
}

export default function useFindClickPosition() {
    //console.log(`%c HOOK `, `background-color:${ log_colors.hook }`,`for Find Click Position`);
    const trackers_open = useRef<number>(0);

    function track_click({ele_name, active, ele_pos, update_func }:Types_click_track){
        document.body.addEventListener("click", handle_click);

        let is_open:boolean = false;
        function handle_click(e:MouseEvent){
            
            trackers_open.current++
            
            let is_active:boolean = active;

            const click_pos:Types_client_position = {
                x: e.clientX, 
                y: e.clientY
            }
            
            if(is_active){
                console.log(`   %c CLICK TRACK ACTIVE `, `background-color:${ log_colors.hook }`, `for ${ele_name}`, `tracker_open: ${trackers_open.current}`, `is_open: ${is_open}` );
                console.log(`   %c DATA `, `background-color:${ log_colors.data }`,`for track_ele_pos`,  ele_pos,
                    '\n', "right", ele_pos!.right,
                    '\n', "left", ele_pos!.left,
                    '\n', "top", ele_pos!.top,
                    '\n', "bottom", ele_pos!.bottom,
                );
                console.log("   the click_pos: ", click_pos.x , ", ", click_pos.y);
                
                if( click_pos.x > ele_pos!.right || 
                    click_pos.x < ele_pos!.left ||
                    click_pos.y > ele_pos!.bottom ||
                    click_pos.y < ele_pos!.top ||
                    is_open && trackers_open.current > 1
                ){
                    console.log(`%c CLICKED OUTSIDE `, `background-color:${ log_colors.important }`);
                    update_func!(true);
                    is_active = false;
                    document.body.removeEventListener("click",handle_click);
                    trackers_open.current--
                } else {
                    is_open = true;
                }
            };
        }
    }

return track_click;
}
