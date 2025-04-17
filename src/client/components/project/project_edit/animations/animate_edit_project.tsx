// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
    /* LOGS */ import { useEffect, useRef, useState } from "react";
import { log_colors } from "../../../../styles/_log_colors.js";

// TYPE DEFINITIONS

interface Types_animation_elements{
    btn_type?: string;
    btn_box_ele?: HTMLDivElement;
    input_box_ele?: HTMLDivElement;
    add_btn_ele?: HTMLButtonElement;
    edit_btn_ele?: HTMLButtonElement;
}

interface Types_animate_forwards{
    animate_forwards:boolean;
}

interface Types_animation_ele{
    ele: HTMLDivElement;
    animation: string;
}



// THE COMPONENT 
export default function animate_edit_project() {
    console.log(`%c ANIMATION `, `background-color:${ log_colors.animation }`, `animate_edit_project`);

    const animation_elements = useRef<Types_animation_elements>({})
    function initiate_animation({ btn_box_ele, input_box_ele, btn_type, add_btn_ele, edit_btn_ele}:Types_animation_elements) {
        animation_elements.current = {
            btn_box_ele: btn_box_ele,
            input_box_ele: input_box_ele,
            btn_type: btn_type,
            add_btn_ele: add_btn_ele,
            edit_btn_ele: edit_btn_ele
        }
        console.log(`%c DATA `, `background-color:${ log_colors.data }`,`for animation_elements.current`,'\n' ,animation_elements.current);
        run_animation({animate_forwards:true})
    }
    


    function run_animation({animate_forwards}:Types_animate_forwards){
        console.log(`%c ANIMATION RAN `, `background-color:${ log_colors.animation }`, `animate_edit_project`);

        const ele_1:Types_animation_ele = {
            ele: animation_elements.current!.btn_box_ele!,
            animation: "toggle_btn_box_visibility 0.5s"
        }
    
        const ele_2:Types_animation_ele = {
            ele: animation_elements.current!.input_box_ele!,
            animation: "toggle_input_box_visibility 1s"
        }
    
    
        const open_btn_ele = animation_elements.current!.btn_type! === "add" ? animation_elements.current!.add_btn_ele! : animation_elements.current!.edit_btn_ele!;
        const close_btn_ele = animation_elements.current!.btn_type! !== "add" ? animation_elements.current!.add_btn_ele! : animation_elements.current!.edit_btn_ele!;
    
        const start:Types_animation_ele = animate_forwards ? ele_1 : ele_2;
        const end:Types_animation_ele = !animate_forwards ? ele_1 : ele_2;
        const animation_direction = animate_forwards ? "normal" : "reverse";
    
    
        if(animate_forwards){
            button_animation()
        } else {
            start_animation()
        }
        
    
        function button_animation(){
            open_btn_ele.style.animation = `toggle_selected_btn 0.5s ease ${animation_direction} forwards`;
            close_btn_ele.style.animation = `toggle_hidden_btn 0.5s ease ${animation_direction} forwards`;
    
            if(animate_forwards){
                open_btn_ele.addEventListener("animationend", btn_animation);
            } else {
                open_btn_ele.addEventListener("animationend", btn_animation);
                open_btn_ele.classList.toggle("btn_open");
                close_btn_ele.classList.toggle("btn_close");
            }
    
            function btn_animation(){
                if(animate_forwards){
                    open_btn_ele.classList.toggle("btn_open");
                    close_btn_ele.classList.toggle("btn_close");
                    open_btn_ele.style.animation = "";
                    close_btn_ele.style.animation = "";
                    open_btn_ele.removeEventListener("animationend", btn_animation);
    
                    //start_animation()
                    setTimeout(()=>{start_animation()},1)
                } else {
                    open_btn_ele.removeEventListener("animationend", btn_animation);
                    open_btn_ele.style.animation = "";
                    close_btn_ele.style.animation = "";
                }
            }
            
        }
    
    
        function start_animation(){
            start.ele.style.animation = `${start.animation} ease-in ${animation_direction} forwards`
            start.ele.addEventListener("animationend", adjust_animation_1);
        }
    
        function adjust_animation_1(){
            start.ele.classList.toggle("box_closed")
            start.ele.style.animation = "";
            start.ele.removeEventListener("animationend", adjust_animation_1);
    
            end.ele.classList.toggle("box_closed")
            end.ele.style.animation = `${end.animation} ease-out ${animation_direction} forwards`
            end.ele.addEventListener("animationend", adjust_animation_2);
        }
    
        function adjust_animation_2(){
            end.ele.style.animation = "";
            end.ele.removeEventListener("animationend", adjust_animation_2);
            if(!animate_forwards){
                button_animation()
            }
        }
    }






// MEMOS AND EFFECTS


// RETURNED VALUES 
    return({
        initiate_animation: ({btn_box_ele, input_box_ele, btn_type, add_btn_ele, edit_btn_ele}:Types_animation_elements) => {
            initiate_animation({btn_box_ele, input_box_ele, btn_type, add_btn_ele, edit_btn_ele})
        },
        run_animation: ({animate_forwards}:Types_animate_forwards) => {
            run_animation({animate_forwards:animate_forwards})
        }
            

    });
}