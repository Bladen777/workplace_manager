import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

// ROUTE IMPORTS
import _Routes from "./routes/_Routes.js";
import Error_Page from "./routes/Error_Page.js";
import App from "./App.js";


// STYLE IMPORTS
import "./styles/_universal/main.css";
import "./styles/_universal/general_styling.css"
import "./styles/_universal/colors.css"
import "./styles/_universal/type.css"
import "./styles/_universal/form_auto_input.css"

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
