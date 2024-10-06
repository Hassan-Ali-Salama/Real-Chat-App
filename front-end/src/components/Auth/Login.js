import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigateFun = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    if (email !== "" && password !== "") {
      navigateFun("/chat");
    } else {
      alert("Enter your Email and Password!!");

      console.log("Enter your Email and Password!!");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-black">
      <div className="absolute top-0 left-0 text-white text-2xl font-bold m-3">
        chat<span className="text-blue-300">app</span>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="mt-6 text-2xl font-bold text-center text-gray-900">
          Login to your account
        </h2>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="font-bold ml-1"> 
                Email:
              </label>
              {/* sr-only */}
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="balamia@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="font-bold ml-1" >
                Password:
              </label>
              {/* sr-only */}
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <NavLink
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot Password?
              </NavLink>
            </div>
          </div>

          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200"
            >
              Login now
            </button>
          </div>

          <div className="flex justify-center text-sm">
            <span className="text-gray-500">Don't Have An Account?</span>
            <NavLink
              to="/Signup"
              className="ml-2 font-medium text-blue-600 hover:text-blue-500"
            >
              Sign Up
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
