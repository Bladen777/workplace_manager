//LOCAL IMPORTS
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import AnimatedOutlet from "./routes/_Animated_Outlet.js";

function App() {
  console.log('%cApp Called', 'background-color:purple',);
  return (
      <>
          <Header />
          <div id="animated_outlet">
            <AnimatedOutlet /> 
          </div>
          <Footer />
      </>
  )
}

export default App
