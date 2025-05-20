import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

// GENERAL STYLE IMPORTS
  import "./styles/main.css";
  import "./styles/_universal/general_styling.css"
  import "./styles/_universal/colors.css"
  import "./styles/_universal/type.css"
  import "./styles/_universal/form_auto_input.css"
  import "./styles/_universal/form_dd.css"


// ROUTE IMPORTS
import App from "./App.js";
import _Routes from "./routes/_Routes.js";
import Error_Page from "./routes/Error_Page.js";

// HIGHEST PRIORITY STYLES
  import "./styles/_universal/animations.css"
  
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
      <RouterProvider router={router}/>
  //</React.StrictMode>
);

