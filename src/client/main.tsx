import "./styles/_main.css"
import "./styles/_type.css"

import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"


// ROUTE IMPORTS
import _Routes from "./routes/_Routes.js"
import Error_Page from "./routes/Error_Page.js"
import App from "./App.js";


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
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
);
