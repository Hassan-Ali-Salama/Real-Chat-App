import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Sidebar({ chats, setCurrentChat }) {
  const [profileImage, setProfileImage] = useState("");
  const [profileName, setProfileName] = useState("");

  // Load profile data from localStorage when the component mounts
  useEffect(() => {
    const savedImage = localStorage.getItem("image");
    const savedName = localStorage.getItem("name");

    if (savedImage) setProfileImage(savedImage);
    if (savedName) setProfileName(savedName);
  }, []);

  return (
    <div className="w-1/4 bg-gradient-to-b from-blue-900 to-white p-4 relative">
      <h2 className="text-2xl font-bold mb-4 text-white">
        chat<span className="text-blue-300">app</span>
      </h2>
      <input
        type="text"
        placeholder="Search messages, people"
        className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <h3 className="font-semibold mb-2">Pinned Chats</h3>
      <div className="space-y-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center justify-between p-2 bg-white shadow-sm rounded cursor-pointer"
            onClick={() => setCurrentChat(chat)}
          >
            <div className="flex items-center space-x-2">
              <img
                src={`https://i.pravatar.cc/150?img=${chat.id}`} 
                className="w-10 h-10 rounded-full"
                alt={chat.name}
              />
              <div>
                <p className="font-semibold">{chat.name}</p>
                <p className="text-sm text-gray-500">{chat.status}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">{chat.time}</span>
          </div>
        ))}
      </div>

      {/* Profile section */}
      <Link to="/profile" className="flex items-center p-2 mt-4 mb-1 text-black bottom-3 left-1 absolute">
        <img
          src={profileImage || "path_to_default_image"} // Use dynamic image source from localStorage
          alt="profile"
          className="w-16 h-16 rounded-full"
        />
        <span className="ml-4 font-bold text-2xl">{profileName || "Profile"}</span> {/* Display dynamic name */}
      </Link>
    </div>
  );
}

export default Sidebar;
