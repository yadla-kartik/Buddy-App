const { Server } = require("socket.io");

let io = null;
const buddyLocations = new Map();

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const toRadians = (deg) => (deg * Math.PI) / 180;

const distanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("buddy:register_location", (payload) => {
      setBuddyLocation(socket.id, payload);
      console.log(`Buddy ${payload?.buddyId} registered location:`, payload);
    });

    socket.on("buddy:update_location", (payload) => {
      setBuddyLocation(socket.id, payload);
      console.log(`Buddy ${payload?.buddyId} updated location:`, payload);
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
    const dist = distanceInMeters(
      taskLat,
      taskLng,
      buddy.latitude,
      buddy.longitude
    );

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
  initSocket,
  notifyNearbyBuddies,
};
