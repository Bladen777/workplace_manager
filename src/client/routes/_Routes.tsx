// LOCAL IMPORTS
import Home from "./Home.js";
import Landing from "./Landing.js";
import Default from "./Defualt.js";

const _Routes = [
    {   name: "Landing",
        index: true,
        element: <Landing/>
    },
    {   id: "home",
        name: "Home",
        path: "/home",
        element: <Home/>
    },
    {   id: "default",
        name: "Default",
        path: "/default",
        element: <Default/>

    }


]

export default _Routes;