import { useRef } from "react";

// STYLE IMPORTS
    /* LOGS */ 
import { log_colors } from "../../../styles/_log_colors.js";

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS

interface Types_animation_elements{
    hide_ele?: HTMLDivElement;
    box_ele?: HTMLDivElement;
}

interface Types_animate_props{
    animate_forwards:boolean;
}

interface Types_ele_size{
    size: string;
}


// THE COMPONENT 
export default function Animate_initial_load() {
    

    const animation_elements = useRef<Types_animation_elements>({})
    function initiate_animation({box_ele}:Types_animation_elements) {
        animation_elements.current = {
            box_ele: box_ele,
        }
    }

    async function run_animation({size}:Types_ele_size){
        console.log(`%c ANIMATION RAN `, `${ log_colors.animation }`, `Animate_initial_load`);
        const ele =  animation_elements.current!.box_ele!;

        const animation = size === "big" ? "big_initial_load 1s" : "small_initial_load 1s";

        ele.style.animation = `${animation} ease-in normal forwards`
        ele.addEventListener("animationend", animation_finished);

        function animation_finished(){
            ele.style.animation = "";
            ele.classList.remove("initial_hide");
            ele.removeEventListener("animationend", animation_finished);
        }   
    }
// MEMOS AND EFFECTS


// RETURNED VALUES 
    return({
        initiate_animation: ({hide_ele, box_ele}:Types_animation_elements) => {
            initiate_animation({hide_ele, box_ele})
        },
        run_animation:({size}:Types_ele_size) => {
            run_animation({size:size})
        }
    }); 
}