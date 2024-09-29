import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
    } else {
      setErrorMessage("");
      console.log("Form submitted");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Welcome message */}
      <div className="w-1/2 bg-gradient-to-b from-blue-900 to-black flex items-center justify-center relative">
        <div className="text-white text-center">
          {/* chat app Logo */}
          <div className="absolute top-0 left-0 text-white text-2xl font-bold m-3">
            chat<span className="text-blue-300">app</span>
          </div>

          {/* Text Welcome */}
          <div className="text-white text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 mb-4">
              Welcome.
            </h1>
            <p className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 mb-2">
              Start your journey
            </p>
            <p className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 mb-2">
              now with our
            </p>
            <p className="text-xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
              Chat App!
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold mb-6">Create an account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
              Create account
            </button>
          </form>
          <p className="text-gray-600 text-center mt-4">
            Already have an account?
            <NavLink to="/login" className="text-blue-500 hover:underline">
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
