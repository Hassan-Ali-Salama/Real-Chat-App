// Components/Chat.js
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import io from "socket.io-client";

let socket;
const endpoint = "http://localhost:3000";
function Chat() {
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState("");
  const [messages, setMessages] = useState([]);
  const [userName, setName] = useState("");
  const [roomid, setroomid] = useState("");

  useEffect(() => {
    socket = io(endpoint);

    socket.emit("connection");
    socket.emit("join", { userName, roomid }, (err) => {
      if (err) {
        console.log(err.message);
      }
    });

    return () => {
      socket.disconnect(); // Properly disconnect socket on unmount
    };
  }, []);

  const sendMessage = (e) => {
    // socket.emit("sendmessage", message, setMessage(""));
  };

  // بيانات افتراضية للمحادثات
  const chats = [
    {
      id: 1,
      name: "Grace Miller",
      status: "Can’t wait for the weekend!",
      time: "10:25 AM",
    },
    {
      id: 2,
      name: "Lucas Williams",
      status: "Hey, how's it going?",
      time: "10:30 AM",
    },
    { id: 3, name: "Liam Anderson", status: "Typing...", time: "04:50 PM" },
    // Add more chats here if needed
  ];

  return (
    <div className="flex h-screen">
      <Sidebar chats={chats} setCurrentChat={setCurrentChat} />
      <ChatArea currentChat={currentChat} sendMessage={sendMessage} />
    </div>
  );
}

export default Chat;
