import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import AboutUs from "./components/AboutUs";
import Login from "./components/Login";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import SetCode from "./components/SetCode";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
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
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/setcode" element={<SetCode />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="*" element={<h1>404. Page Not Found </h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
