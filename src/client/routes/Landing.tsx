import { useLocation, Link } from "react-router-dom";

// THE COMPONENT
export default function Landing() {
  console.log('%cLanding Called', 'background-color:purple',);

  const location = {
    this_location: 0,
  }
  return (
    <>
      <h1>Landing</h1>
      <div>
        <a href="/auth/google">
          <button><p>Login</p></button>
        </a>
      </div>
      <Link
      to={"/default"}
      >
        <h1>Default</h1>
      </Link>
  </>
  )
}
