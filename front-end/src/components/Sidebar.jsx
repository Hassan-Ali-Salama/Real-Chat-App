import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Chat from "./Chat";
import Room from "./Room.jsx";
import { Login_Context, Personel_context } from "../states/contexs.jsx";

function Sidebar() {
  // Destructure pinnedChats correctly
  const [profileImage, setProfileImage] = useState("");
  const [profileName, setProfileName] = useState("");
  const [chats, setChats] = useState();
  const { Login_Show, setLogin } = useContext(Login_Context);
  var { Personel, setPersonel } = useContext(Personel_context);

  // Load profile data from localStorage when the component mounts

  useEffect(() => {
    const savedImage = localStorage.getItem("image");
    const savedName = localStorage.getItem("name");

    if (savedImage) setProfileImage(savedImage);
    if (savedName) setProfileName(savedName);
    console.log("useEffect is running"); // Debug log
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3003/rooms/getallrooms",
          {
            withCredentials: true,
          }
        );
        console.log("the response", response.data);
        setChats(response.data);
        console.log("after response", response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchData();
  }, []);

  // function pinnedRooms()
  // {
  //   console.log('from chats',chats)
  //   chats.data.map((chat) => {
  //      const room = chat.users.filter((u)=>{
  //       return Personel.email === u;
  //      })
  //      if(room.length > 0)
  //      {
  //       console.log('from room',room)
  //       console.log('from if',chat.name);
  //       return (
  //         <div key={chat._id}>
  //           <Link to={`/Room/${chat._id}/${Personel.email}/${chat.name}`}>
  //             <div>{chat.name}</div>
  //           </Link>
  //         </div>
  //       );
  //      }

  //      return null;
            
  //         })
  // }

  return (
    <div className="w-1/4 bg-gradient-to-b from-blue-900 to-white p-4 relative">
      <h2 className="text-2xl font-bold mb-4 text-white">
        chat<span className="text-blue-300">app</span>
      </h2>
      <input
        type="text"
        placeholder="Search Rooms, people"
        className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <h3 className="font-semibold mb-2">Pinned Chats</h3>
      <div className="space-y-4">
        {console.log("side", chats)}

        {chats ? ( // Check if pinnedChats is defined and has elements
          <>
            <div>
              {chats.data.map((chat) => {
                const room = chat.users.filter((u) => {
                  return Personel.email === u;
                });
                if (room.length > 0) {
                  console.log("from room", room);
                  console.log("from if", chat.name);
                  return (
                    <div key={chat._id}>
                      <Link
                        to={`/Room/${chat._id}/${Personel.email}/${chat.name}`}
                      >
                        <div>{chat.name}</div>
                      </Link>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </>
        ) : (
          <div>No chats available</div>
        )}
      </div>

      {/* Profile section */}
      <Link
        to="/profile"
        className="flex items-center p-2 mt-4 mb-1 text-black bottom-3 left-1 absolute"
      >
        <img
          src={profileImage || "path_to_default_image"} // Use dynamic image source from localStorage
          alt="profile"
          className="w-16 h-16 rounded-full"
        />
        <span className="ml-4 font-bold text-2xl">
          {profileName || "Profile"}
        </span>
      </Link>
    </div>
  );
}

export default Sidebar;
