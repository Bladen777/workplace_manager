import { useRef } from "react";

// STYLE IMPORTS
    /* LOGS */ 
import { log_colors } from "../../../../styles/_log_colors.js";

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

interface Types_animation_ele{
    ele: HTMLDivElement;
}


// THE COMPONENT 
export default function Animate_po_load() {
    

    const animation_elements = useRef<Types_animation_elements>({})
    function initiate_animation({ hide_ele, box_ele}:Types_animation_elements) {
        animation_elements.current = {
            hide_ele: hide_ele,
            box_ele: box_ele,
        }
    }

    async function run_animation({animate_forwards}:Types_animate_props):Promise<boolean>{
        console.log(`%c ANIMATION RAN `, `${ log_colors.animation }`, `Animate_po_load`);

        const animation_direction = animate_forwards ? "normal" : "reverse"

        const ele_1:Types_animation_ele = {
            ele: animation_elements.current!.hide_ele!,
        }
    
        const ele_2:Types_animation_ele = {
            ele: animation_elements.current!.box_ele!,
        }
    
        const animation = "toggle_po_load 0.5s";

        const start:Types_animation_ele = ele_1;

/*
        const start:Types_animation_ele = animate_forwards ? ele_1 : ele_2;
        const end:Types_animation_ele = !animate_forwards ? ele_1 : ele_2;
*/
        
        console.log(`%c DATA `, `${ log_colors.data }`,`for start.ele`,'\n' ,start.ele);
        

        async function animation_promise():Promise<boolean>{
            return new Promise((resolve)=>{
                start_animation()
                function start_animation(){
                    start.ele.style.animation = `${animation} ease-out ${animation_direction} forwards`;

    
                    start.ele.addEventListener("animationend", end_animation);
                }
                function end_animation(){
                    start.ele.classList.toggle("project_overview_box_closed");
                    start.ele.style.animation = "";
                    start.ele.removeEventListener("animationend", end_animation);
                    resolve(true)
                }


/*
                function start_animation(){
                    start.ele.style.animation = `${animation} ease-out normal forwards`;
                    end.ele.style.animation = `${animation} ease-out reverse forwards`;
                    start.ele.addEventListener("animationend", end_animation);
                }

                function end_animation(){
                    
                    end.ele.classList.toggle("project_overview_box_closed");
                    end.ele.style.animation = "";

                    start.ele.classList.toggle("project_overview_box_closed");
                    start.ele.style.animation = "";
                    start.ele.removeEventListener("animationend", end_animation);
                    resolve(true)
                }
*/
    
                
            })
        }

        return await animation_promise()
    }
// MEMOS AND EFFECTS


// RETURNED VALUES 
    return({
        initiate_animation: ({hide_ele, box_ele}:Types_animation_elements) => {
            initiate_animation({hide_ele, box_ele})
        },
        run_animation: async({animate_forwards}:Types_animate_props) => {
            await run_animation({animate_forwards:animate_forwards})
        }
    }); 
}