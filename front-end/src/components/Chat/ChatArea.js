// components/ChatArea.js
import React from "react";
import Header from "./Header";

function ChatArea({ currentChat, setMessage, sendMessage }) {
  if (!currentChat) {
    return (
      <div className="w-3/4 p-4 bg-gradient-to-r from-blue-900 to-black flex items-center justify-center ">
        <div className="text-white text-center">
          <div className="text-5xl font-bold text-blue-300 mb-3">
            chat<span className="text-white">app</span>
          </div>
          <div className="text-white text-2xl font-semibold">
            Start a new chat or select one to see messages
          </div>
        </div>
      </div>
    );
  }

  // رسائل افتراضية
  const messages = [
    {
      from: currentChat.name,
      content: "Hi Jack! I'm doing well, thanks. Can’t wait for the weekend!",
      time: "10:30 AM",
    },
    {
      from: "Jack Raymonds",
      content:
        "I know, right? Weekend plans are the best. Any exciting plans on your end?",
      time: "10:30 AM",
    },
    {
      from: currentChat.name,
      content:
        "Absolutely! I’m thinking of going for a hike on Saturday. How about you?",
      time: "10:30 AM",
    },
    {
      from: "Jack Raymonds",
      content:
        "Hiking sounds amazing! I might catch up on some reading and also meet up with a few friends on Sunday.",
      time: "10:30 AM",
    },
  ];

  return (
    <div className="w-3/4 flex flex-col bg-gray-100">
      <Header chat={currentChat} />
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start mb-4 ${
              msg.from === "Jack Raymonds" ? "justify-end" : ""
            }`}
          >
            {msg.from !== "Jack Raymonds" && (
              <img
                src={`https://i.pravatar.cc/150?img=${currentChat.id}`}
                className="w-10 h-10 rounded-full mr-2"
                alt={currentChat.name}
              />
            )}
            <div
              className={`max-w-sm p-3 rounded-lg ${
                msg.from === "Jack Raymonds"
                  ? "bg-blue-500 text-white"
                  : "bg-white shadow-sm"
              }`}
            >
              <p>{msg.content}</p>
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
          onChange={(e) => setMessage(e.value)}
        />
        <button className="p-2 rounded-full bg-blue-500 text-white" onChange={sendMessage()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
