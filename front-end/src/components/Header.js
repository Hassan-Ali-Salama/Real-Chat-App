// components/Header.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

function Header({ chat }) {
  return (
    <div className="p-4 bg-white border-b flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={`https://i.pravatar.cc/150?img=${chat.id}`}
          className="w-10 h-10 rounded-full"
          alt={chat.name}
        />
        <div>
          <p className="font-semibold">{chat.name}</p>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300  text-blue-700 hover:text-blue-900 transition-all duration-500">
          <FontAwesomeIcon icon={faPhone} />
        </button>
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300  text-blue-700  hover:text-blue-900 transition-all duration-500">
          <FontAwesomeIcon icon={faVideo} />
        </button>
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-blue-700  hover:text-blue-900 transition-all duration-500 ">
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>
      </div>
    </div>
  );
}

export default Header;
