//LOCAL IMPORTS
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import AnimatedOutlet from "./routes/_Animated_Outlet.js";
import {Provide_Context_User_Info} from "./components/user_info/Context_user_info.js";

function App() {
  console.log('%cApp Called', 'background-color:purple',);
  return (
    <>
      <Provide_Context_User_Info>
        <Header />
          <AnimatedOutlet /> 
        <Footer />
      </Provide_Context_User_Info>
    </>
  )
}

export default App
