import {  Link } from "react-router-dom";

// STYLE IMPORTS
import "../styles/landing.css"

// THE COMPONENT
export default function Landing() {
  console.log('%cLanding Called', 'background-color:purple',);

  const location = {
    this_location: 0,
  }
  return (
    <>
      <h1>Landing</h1>
      <button id="google_login_btn" >
            <a  id="googel_login_link" href='/auth/google'>
                Login with Google
            </a>  
        </button>
      <Link
      to={"/default"}
      >
        <h1>Default</h1>
      </Link>
  </>
  )
}
