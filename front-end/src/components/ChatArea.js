// components/ChatArea.js
import React, { useEffect, useState, useContext } from "react";
import Header from "./Header";
import { io } from "socket.io-client";
import { Login_Context, Personel_context } from "../states/contexs.jsx";
import axios from "axios";

function ChatArea({roomname, roomid}) {
  var { Personel, setPersonel } = useContext(Personel_context);
  const [text, setText] = useState();
  const [sender, setSender] = useState();
  const[messages, setMessages] = useState();
  
  const endpoint = 'http://localhost:3003';
  let socket;
  socket = io(endpoint);
  socket.emit("lets send");
  console.log('from id',roomid, Personel.email);

 useEffect(()=>{
  console.log('roooooooooooooooooooooomid', roomid)
  const fetch = async ()=>{
    const response = await axios.get(`http://localhost:3003/rooms/room/${roomid}`);
    console.log('getr oomid', response.data.data.messages);
    setMessages(response.data.data.messages);
  }

  fetch();
  
 },[messages])

 const sendMessage = ()=>{
  console.log('click send')
  socket.emit('send',{text,sender:Personel.email,roomid:roomid})
 }
  if (!messages) {
    return (
      <div className="w-3/4 p-4 bg-gradient-to-r from-blue-900 to-black flex items-center justify-center ">
        <div className="text-white text-center">
          <div className="text-5xl font-bold text-blue-300 mb-3">
            chat<span className="text-white">app</span>
          </div>
          <div className="text-white text-2xl font-semibold">
           No chats at the moment 
          </div>
        </div>
      </div>
    );
  }

  // رسائل افتراضية
  

  return (
    <div className="w-3/4 flex flex-col bg-gray-100">
      <Header  roomname = {roomname}/>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start mb-4 ${
              msg.from === Personel.email ? "justify-end" : ""
            }`}
          >
            {/* {msg.from !== "Jack Raymonds" && (
              <img
                src={`https://i.pravatar.cc/150?img=${currentChat.id}`}
                className="w-10 h-10 rounded-full mr-2"
                alt={currentChat.name}
              />
            )} */}
            <div
              className={`max-w-sm p-3 rounded-lg ${
                msg.from === "Jack Raymonds"
                  ? "bg-blue-500 text-white"
                  : "bg-white shadow-sm"
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-xs text-green-800">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Typing area */}
      <div className="p-4 bg-white flex items-center space-x-4 border-t">
        <input
          type="text"
          placeholder="Type message..."
          //   className="w-full p-2 border rounded"
          className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>{setText(e.target.value); console.log(e.target.value)}}
        />
        <button className="p-2 rounded-full bg-blue-500 text-white"
        onClick={()=>{sendMessage()}}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
