import React from "react";
import Chat from './Chat';
import './ChatArea';
import RoomModel from "../../../back-end/db/Models/Room.model";

const Room = (userid, roomid)=>
{
   useEffect(() => {
    socket = io(endpoint);

    socket.emit("connection");
    socket.emit("join", { userid, roomid }, (err) => {
      if (err) {
        console.log(err.message);
      }
    });

    return () => {
      socket.disconnect(); // Properly disconnect socket on unmount
    };
  }, []);
    return (
      <div className="flex h-screen">
        <Sidebar chats={userid.rooms} setCurrentChat={setCurrentChat} />
        <ChatArea currentChat={currentChat} sendMessage={sendMessage} />
      </div>
    );
}