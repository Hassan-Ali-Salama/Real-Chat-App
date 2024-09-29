import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import AboutUs from "./components/AboutUs";
import Login from "./components/Login";
import Contact from "./components/Contact";

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
          <Route path="*" element={<h1>404. Page Not Found </h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
