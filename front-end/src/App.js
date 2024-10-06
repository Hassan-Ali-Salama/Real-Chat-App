import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login2";
import Signup from "./components/Auth/Signup";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import Profile from "./components/Profile/Profile";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<h1>404. Page Not Found </h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
