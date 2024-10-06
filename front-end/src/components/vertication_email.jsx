import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Login_Context, Personel_context } from "../states/contexs.jsx";
import React, { useContext, useState } from "react";
import ReactCodeInput from 'react-verification-code-input';

const url = "http://localhost:3003";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");

  const { Login_Show, setLogin } = useContext(Login_Context);
  const { Personel, setPersonel } = useContext(Personel_context);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigateFun = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(loginEmail)) {
      console.log("unvalid")
      setLoginError("Please enter a valid email address.");
      return;
    }

    const passwordError = validatePassword(loginPassword);
    if (passwordError) {
      setLoginError(passwordError);
      return;
    }

    try {
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.showError) {
        setLoginError(`${data.title}\n${data.message}`);
        return;
      }

      if (data.success) {
        setLogin(true);
        setPersonel(data); // Assuming data contains Personel info
        setLoginError(""); // Clear any error messages
        navigateFun("/Chat"); // Redirect to dashboard or another route after successful login
      } else {
        setLoginError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError("An error occurred during login.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-black">
      <div className="absolute top-0 left-0 text-white text-2xl font-bold m-3">
        chat<span className="text-blue-300">app</span>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="mt-6 text-2xl font-bold text-center text-gray-900">
           Enter your code 
         </h2>
          <ReactCodeInput/>

          <div className="d-flex flex-row justify-items-center w-100 my-5">
            <button
              type="submit"
              className="w-25 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200"
            >
             Verify
            </button>
            
          </div>
          <div className="text-lg"> {/* Increased font size */}
            <span className="text-gray-500">Didn't receive email?</span> 
            <a href="#" className="text-blue-600 hover:underline ml-2 font-bold"> {/* Blue and bold text */}
              Try again
            </a>
          </div>
      </div>
    </div>
  );
};

export default Login;
