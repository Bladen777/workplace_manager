import { useRouteError } from "react-router-dom";


interface RouteError extends Error {
    status?: number;
    statusText?:string;
}

function Error_Page() {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p style={{color:"white"}}>
        <i>{error.statusText || error.message}</i>
      </p>
      <img src="https://www.brandwatch.com/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=uploads/brandwatch/troll.jpg" alt="you've been trolled by the code"></img>
    </div>
  );
}
export default Error_Page;