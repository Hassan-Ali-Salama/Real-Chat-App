import React from "react";
import { useState, useEffect } from "react";

import { Socket } from "socket.io-client";

import NotificationList from "./NotificationList";

const Notification = ({ text, sender, roomname, roomid }) => {
  return (
    <div className="notification-page p-6 min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Notifications
      </h2>
      <NotificationList />
    </div>
  );
};

export default Notification;

