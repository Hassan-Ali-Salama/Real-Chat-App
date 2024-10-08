import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext,useEffect } from "react";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import AboutUs from "./components/AboutUs";
import Login from "./components/Login";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import { Login_Context,Personel_context } from "./states/contexs.jsx"
import VerificationForm from "./components/vertication_email.jsx"
const url = "http://localhost:3003"

function App() {
      const { Login_Show, setLogin } = useContext(Login_Context);
    var {Personel,setPersonel}=useContext(Personel_context);
  
  useEffect(() => {
    async function fetch_data() {
      try {
        // Fetch the authentication status from the server
        const res = await fetch(`${url}/auth/AreIamAuthenticated`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          
          credentials: 'include'   
        });

        // Convert the response to JSON
        const data = await res.json();
        
        // Log the response data for debugging
        console.log(data);
      setPersonel(data);
      console.log(Personel)
        // Set login state based on the server's response
        setLogin(data.auth);
      } catch (error) {
        console.error("Error fetching authentication status:", error);
        setLogin(false); // Set login to false in case of any errors
      }
    }

    fetch_data();
  }, [setLogin]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={Login_Show?<Home />:<Login/>} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Chat" element={Login_Show?<Chat />:<Login/>} />
          <Route path="/AboutUs" element={Login_Show?<AboutUs />:<Login/>} />
          <Route path="/Contact" element={Login_Show?<Contact />:<Login/>} />
          <Route path="/profile" element={Login_Show?<Profile />:<Login/>} />
          <Route path="/vertaction" element={<VerificationForm/>} />

          <Route path="*" element={<Login/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
