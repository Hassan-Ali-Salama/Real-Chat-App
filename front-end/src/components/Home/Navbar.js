import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigateFun = useNavigate();
  return (
    <>
      <nav className="flex justify-between p-5">
        <div className="text-white text-2xl font-bold">
          chat<span className="text-blue-300">app</span>
        </div>

        <div className="flex items-center">
          <ul className="flex space-x-6 text-white">
            <li>
              <NavLink
                to="/AboutUs"
                className="hover:text-blue-200 transition-all duration-200 font-bold"
              >
                AboutUs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="hover:text-blue-200 transition-all duration-200 font-bold"
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className="hover:text-blue-200 transition-all duration-200 font-bold"
              >
                Log In
              </NavLink>
            </li>
          </ul>

          <button
            className="bg-white text-blue-950 px-4 py-2 rounded-md hover:bg-blue-600 border hover:border-white hover:text-white ml-4 transition-all duration-200"
            onClick={() => {
              navigateFun("/signup");
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
