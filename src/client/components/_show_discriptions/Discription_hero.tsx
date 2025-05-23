import {useEffect, useRef } from "react";

// STYLE IMPORTS 
    /* LOGS */ import { log_colors } from "../../styles/_log_colors.js";
    import "../../styles/_show_disciptions/disciption.css"

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// COMPONENT IMPORTS 

// TYPE DEFINITIONS
interface Types_props{

}

// THE COMPONENT 
export default function Discription_hero({}:Types_props) {
    const initial_render = useRef<boolean>(true);
    console.log(`%c ${initial_render.current ? "INITIAL RENDER" : ""} COMPONENT `, `${ log_colors.component }`, `Discription_hero`);


// MEMOS AND EFFECTS

    useEffect(() =>{
        initial_render.current = false;
    },[])


// RETURNED VALUES 
    return(
        <section 
            className="discription_hero_container general_section"
        >
            <h1 className="title">
                WORKPLACE MANAGER REACT APP
            </h1>

            <div
                className="web_skills"
            >
                <p>React.js</p>
                <p>Vite</p>
                <p>PostgreSQL</p>
                <p>Node.js</p>
                <p>Express</p>
                <p>Axios</p>
                <p>TypeScript</p>
                <p>JavaScript</p>
                <p>HTML 5</p>
                <p>CSS 3</p>
            </div>

            <div className="description">
                <p> 
                    This is the beginnings of a App for changing the ways we communicate our project progresses.
                    This 

                </p>
            </div>

        </section>
    ); 
}