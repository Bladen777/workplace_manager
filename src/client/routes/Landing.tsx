import {  Link } from "react-router-dom";

// COMPONENT IMPORTS 

// CONTEXT IMPORTS 

// HOOK IMPORTS 

// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "../styles/_log_colors.js";
import "../styles/landing.css"

// TYPE DEFINITIONS

// THE COMPONENT 
export default function Landing() {
  console.log(`%c ROUTE `, `${log_colors.route}`, `Landing`);

  const location = {
    this_location: 0,
  }


// MEMOS AND EFFECTS


// RETURNED VALUES 
  return (
    <main id="landing_page" className="main_page">

      <section id="landing_hero">
        <h1>Landing</h1>
        <div id="landing_hero_banner">Landing Hero Banner</div>
      </section>

      <section id="landing_google_login">
      <button id="google_login_btn" >
            <a  id="googel_login_link" href='/auth/google'>
                Login with Google
            </a>  
      </button>
      </section>
      

      <section id="landing_about">
        <h2> Landing About</h2>
        <div id="landing_about_content">
          about the landing
        </div>
      </section>

  </main>
  )
}
