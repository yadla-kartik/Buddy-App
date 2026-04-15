import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "../config/env";

const baseConfig = {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: false,
};

let adminSocket = null;
let buddySocket = null;
let userSocket = null;

export const connectAdminSocket = () => {
  if (!adminSocket) {
    adminSocket = io(SOCKET_BASE_URL, baseConfig);
  }

  if (!adminSocket.connected) {
    adminSocket.connect();
  }

  adminSocket.emit("room:join", { role: "admin" });
  return adminSocket;
};

export const disconnectAdminSocket = () => {
  if (!adminSocket) return;
  adminSocket.removeAllListeners();
  adminSocket.disconnect();
  adminSocket = null;
};

export const connectBuddySocket = (buddyId) => {
  if (!buddySocket) {
    buddySocket = io(SOCKET_BASE_URL, baseConfig);
  }

  if (!buddySocket.connected) {
    buddySocket.connect();
  }

  buddySocket.emit("room:join", { role: "buddy", buddyId });
  return buddySocket;
};

export const disconnectBuddySocket = () => {
  if (!buddySocket) return;
  buddySocket.removeAllListeners();
  buddySocket.disconnect();
  buddySocket = null;
};

export const connectUserSocket = (userId) => {
  if (!userSocket) {
    userSocket = io(SOCKET_BASE_URL, baseConfig);
  }

  if (!userSocket.connected) {
    userSocket.connect();
  }

  userSocket.emit("room:join", { role: "user", userId });
  return userSocket;
};

export const disconnectUserSocket = () => {
  if (!userSocket) return;
  userSocket.removeAllListeners();
  userSocket.disconnect();
  userSocket = null;
};
