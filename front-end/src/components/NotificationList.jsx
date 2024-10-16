import React, { useState, useEffect, useContext } from "react";
import { Login_Context, Personel_context } from "../states/contexs.jsx";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { io } from "socket.io-client";

const NotificationList = (newNotification) => {
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array
  const [notification, setNotification] = useState([]); // Also initialize this
  const [change, setChange] = useState();
  var { Personel, setPersonel } = useContext(Personel_context);
  let socket ;
  socket = io("http://localhost:3003");
  useEffect(() => {
    socket.on('connect',()=>{
      console.log('whyy')
    })
    const fetchNotifications = async () => {
      
      try {
        const response = await axios.get(
          `http://localhost:3003/notify/getallNotify`,
          {
            withCredentials: true,
          }
        );
        console.log("Notifications fetched:", response.data.data);
        setNotifications(response.data.data); // Safely store fetched notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [change]); // Empty dependency array to fetch only on component mount

  useEffect(() => {
    if (newNotification) {
      // Update notifications only if there is a new one
      setNotification((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
    }
  }, [newNotification]); // Only trigger when a new notification arrives

  useEffect(() => {
    console.log("Notification state updated:", notification);
    setChange(Date.now());
  }, [notification]); // Log when notification state changes

  const markAsRead = async (id) => {
    console.log('deletenote',id);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n._id !== id)
    );
      socket.emit('deleteNote',{id});
      console.log('deeeeleeeete')
  };

  return (
    <div className="notification-list max-w-lg mx-auto mt-6">
      {notifications.length === 0 ? (
        <p className="alert alert-info" role="alert">
          No notifications available.
        </p>
      ) : (
        notifications.map((u) => (
          <div
            key={u._id}
            className="list-group-item bg-white border rounded mb-2"
          >
            <h5 className="mb-1">{u.Room}</h5>
            <p className="mb-1">{`a new message: ${u.messages}`}</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => markAsRead(u._id)}
            >
              Mark as Read
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationList;
