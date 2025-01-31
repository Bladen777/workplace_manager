import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"

// CONTEXT IMPORTS
import { Provide_Context_Click_Location } from "./components/context/Context_click_location.js";


// ROUTE IMPORTS
import _Routes from "./routes/_Routes.js"
import Error_Page from "./routes/Error_Page.js"
import App from "./App.js";


// STYLE IMPORTS
import "./styles/_main.css"
import "./styles/_type.css"


// PAGE ROUTING
const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
    errorElement: <Error_Page/>,
    children: _Routes
  }
])

createRoot(document.getElementById("root") as HTMLElement).render(
  //<React.StrictMode>
    <Provide_Context_Click_Location>
      <RouterProvider router={router}/>
    </Provide_Context_Click_Location>
  //</React.StrictMode>,
);
