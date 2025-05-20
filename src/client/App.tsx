// STYLE IMPORTS
  /* LOGS */ import { log_colors } from "./styles/_log_colors.js";

// CONTEXT IMPORTS
import {Provide_Context_user_info} from "./components/user_info/Context_user_info.js";

// HOOK IMPORTS

//COMPONENT IMPORTS
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import AnimatedOutlet from "./routes/_Animated_Outlet.js";

// TYPE DEFINITIONS

function App() {
  console.log(`%c ROUTE `, `${log_colors.route}`, `App`);

// MEMOS AND EFFECTS

// RETURNED VALUES
  return (
    <>
        <Provide_Context_user_info>
          <Header />
            <AnimatedOutlet /> 
          <Footer />
        </Provide_Context_user_info>
    </>
  )
}

export default App

