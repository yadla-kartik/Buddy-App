const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Buddy = require("./models/Buddy");

const ADMIN_ROOM = "buddy-admin:admins";
const GLOBAL_BUDDY_ADMIN_ROOM = "buddy-admin:global";
const getBuddyRoom = (buddyId) => `buddy-admin:buddy:${buddyId}`;
const getUserRoom = (userId) => `task-user:${userId}`;
const getCityBuddyRoom = (city) => `task-city:${String(city || "").trim().toLowerCase()}`;

let io = null;
const buddyLocations = new Map();

const parseCookies = (cookieHeader = "") => {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, pair) => {
      const eqIndex = pair.indexOf("=");
      if (eqIndex === -1) return acc;
      const key = pair.slice(0, eqIndex).trim();
      const value = pair.slice(eqIndex + 1).trim();
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
};

const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const toRadians = (deg) => (deg * Math.PI) / 180;

const distanceInMeters = (lat1, lon1, lat2, lon2) => {
  const radius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c;
};

const setBuddyLocation = (socketId, payload) => {
  const latitude = toNumber(payload?.latitude);
  const longitude = toNumber(payload?.longitude);
  if (!payload?.buddyId || latitude === null || longitude === null) return;

  buddyLocations.set(socketId, {
    buddyId: String(payload.buddyId),
    latitude,
    longitude,
  });
};

const normalizeCity = (city) => String(city || "").trim().toLowerCase();

const joinBuddyCityRoom = async (socket, buddyId) => {
  if (!buddyId) return;

  try {
    const buddy = await Buddy.findById(buddyId).select("city");
    const normalizedCity = normalizeCity(buddy?.city);
    if (!normalizedCity) return;

    socket.join(getCityBuddyRoom(normalizedCity));
    socket.data.buddyCity = normalizedCity;
  } catch (error) {
    console.error("Failed to join buddy city room:", error.message);
  }
};

const createSocketServer = (httpServer, allowedOrigins = []) => {
  io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Origin not allowed by CORS"));
      },
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const adminDecoded = verifyToken(cookies.adminToken);
    const buddyDecoded = verifyToken(cookies.buddyToken);
    const userDecoded = verifyToken(cookies.userToken);

    if (adminDecoded?.role === "admin") {
      socket.data.user = {
        role: "admin",
        id: adminDecoded.id || "admin-static",
      };
    } else if (buddyDecoded?.role === "buddy") {
      socket.data.user = {
        role: "buddy",
        id: String(buddyDecoded.id),
      };
    } else if (userDecoded?.id) {
      socket.data.user = {
        role: "user",
        id: String(userDecoded.id),
      };
    } else {
      socket.data.user = { role: "guest", id: null };
    }

    next();
  });

  io.on("connection", (socket) => {
    const user = socket.data.user || { role: "guest", id: null };

    if (user.role === "admin") {
      socket.join(ADMIN_ROOM);
      socket.join(GLOBAL_BUDDY_ADMIN_ROOM);
    }

    if (user.role === "buddy" && user.id) {
      socket.join(getBuddyRoom(user.id));
      socket.join(GLOBAL_BUDDY_ADMIN_ROOM);
      joinBuddyCityRoom(socket, user.id);
    }

    if (user.role === "user" && user.id) {
      socket.join(getUserRoom(user.id));
    }

    socket.on("room:join", (payload = {}) => {
      const { role, buddyId, userId } = payload;

      if (role === "admin" && user.role === "admin") {
        socket.join(ADMIN_ROOM);
        socket.join(GLOBAL_BUDDY_ADMIN_ROOM);
      }

      if (role === "buddy" && user.role === "buddy") {
        const resolvedBuddyId = user.id || (buddyId ? String(buddyId) : null);
        if (resolvedBuddyId) {
          socket.join(getBuddyRoom(resolvedBuddyId));
          socket.join(GLOBAL_BUDDY_ADMIN_ROOM);
          joinBuddyCityRoom(socket, resolvedBuddyId);
        }
      }

      if (role === "user" && user.role === "user") {
        const resolvedUserId = user.id || (userId ? String(userId) : null);
        if (resolvedUserId) {
          socket.join(getUserRoom(resolvedUserId));
        }
      }
    });

    socket.on("buddy:register_location", (payload) => {
      setBuddyLocation(socket.id, payload);
    });

    socket.on("buddy:update_location", (payload) => {
      setBuddyLocation(socket.id, payload);
    });

    socket.on("disconnect", () => {
      buddyLocations.delete(socket.id);
    });
  });

  return io;
};

const notifyNearbyBuddies = (task) => {
  if (!io) return;

  const taskLat = toNumber(task.taskLatitude);
  const taskLng = toNumber(task.taskLongitude);
  if (taskLat === null || taskLng === null) return;

  for (const [socketId, buddy] of buddyLocations.entries()) {
    const dist = distanceInMeters(taskLat, taskLng, buddy.latitude, buddy.longitude);

    if (dist <= 200) {
      io.to(socketId).emit("task:nearby_flash", {
        taskId: String(task._id),
        taskName: task.taskDescription || task.taskType || "New task",
        price: task.taskPrice,
        distanceMeters: Math.round(dist),
      });
    }
  }
};

module.exports = {
  createSocketServer,
  initSocket: createSocketServer,
  notifyNearbyBuddies,
  ADMIN_ROOM,
  GLOBAL_BUDDY_ADMIN_ROOM,
  getBuddyRoom,
  getUserRoom,
  getCityBuddyRoom,
};
