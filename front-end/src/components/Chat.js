import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import axios from "axios";
import io from 'socket.io-client';



function Chat() {
  const [currentChat, setCurrentChat] = useState(null);
   

 
  

  return (
    <div className="flex h-screen">
      
      <Sidebar />
    </div>
  );
}

export default Chat;
