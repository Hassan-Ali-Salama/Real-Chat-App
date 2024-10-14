// NotificationList.js
import React, { useState } from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      sender: "John Doe",
      text: "Hello, how are you?",
      roomName: "General Chat",
    },
    {
      id: 2,
      sender: "Alice Smith",
      text: "Check out this new feature!",
      roomName: "Feature Updates",
    },
    {
      id: 3,
      sender: "Bob Johnson",
      text: "Do you have a minute to talk?",
      roomName: "Private Chat",
    },
    {
      id: 4,
      sender: "Bob Johnson",
      text: "Do you have a minute to talk?",
      roomName: "Private Chat",
    },
    {
      id: 5,
      sender: "Bob Johnson",
      text: "Do you have a minute to talk?",
      roomName: "Private Chat",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="notification-list max-w-lg mx-auto mt-6">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            sender={notification.sender}
            text={notification.text}
            roomName={notification.roomName}
            onMarkAsRead={() => markAsRead(notification.id)} // Pass mark as read function as prop
          />
        ))
      ) : (
        <p className="text-white">No notifications yet.</p>
      )}
    </div>
  );
};

export default NotificationList;
