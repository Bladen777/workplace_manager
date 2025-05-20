import { useRef } from "react";

// STYLE IMPORTS
    /* LOGS */ 
import { log_colors } from "../../../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS

interface Types_animation_elements{
    btn_ele?: HTMLDivElement;
    box_ele?: HTMLDivElement;
}

interface Types_animate_forwards{
    animate_forwards:boolean;
}

interface Types_animation_ele{
    ele: HTMLDivElement;
    animation: string;
}


// THE COMPONENT 
export default function Animate_flip_switch() {
    const animation_elements = useRef<Types_animation_elements>({})
    function initiate_animation({ btn_ele, box_ele}:Types_animation_elements) {
        animation_elements.current = {
            btn_ele: btn_ele,
            box_ele: box_ele,
        }
    }


        function run_animation({animate_forwards}:Types_animate_forwards){
            console.log(`%c ANIMATION RAN `, `${ log_colors.animation }`, `Animate_flip_switch`);
    
            const animation_direction = animate_forwards ? "normal" : "reverse";
            const ele_1:Types_animation_ele = {
                ele: animation_elements.current!.btn_ele!,
                animation: "toggle_flip_switch_btn 0.5s"
            }
        
            const ele_2:Types_animation_ele = {
                ele: animation_elements.current!.box_ele!,
                animation: animation_direction === "reverse" ? "toggle_flip_switch_box 0.5s" :"toggle_flip_switch_box 1s"
            }
        
            const start:Types_animation_ele = animate_forwards ? ele_1 : ele_2;
            const end:Types_animation_ele = !animate_forwards ? ele_1 : ele_2;
            
            
            start_animation()
            
            function start_animation(){
                start.ele.style.animation = `${start.animation} ease-in ${animation_direction} forwards`
                start.ele.addEventListener("animationend", adjust_animation_1);
            }
        
            function adjust_animation_1(){
                start.ele.classList.toggle("animate_ele_closed");
                start.ele.style.animation = "";
                start.ele.removeEventListener("animationend", adjust_animation_1);
        
                end.ele.classList.toggle("animate_ele_closed")
                end.ele.style.animation = `${end.animation} ease-out ${animation_direction} forwards`
                end.ele.addEventListener("animationend", adjust_animation_2);
            }
        
            function adjust_animation_2(){
                end.ele.style.animation = "";
                end.ele.removeEventListener("animationend", adjust_animation_2);
            }
        }


// MEMOS AND EFFECTS


// RETURNED VALUES 
    return({
        initiate_animation: ({btn_ele, box_ele}:Types_animation_elements) => {
            initiate_animation({btn_ele, box_ele})
        },
        run_animation: ({animate_forwards}:Types_animate_forwards) => {
            run_animation({animate_forwards:animate_forwards})
        }
    }); 
}