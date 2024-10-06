// Components/Chat.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

function Chat() {
  const [currentChat, setCurrentChat] = useState(null);

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
      <ChatArea currentChat={currentChat} />
    </div>
  );
}

export default Chat;
