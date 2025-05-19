import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

// STYLE IMPORTS

// ROUTE IMPORTS
import App from "./App.js";
import _Routes from "./routes/_Routes.js";
import Error_Page from "./routes/Error_Page.js";



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

