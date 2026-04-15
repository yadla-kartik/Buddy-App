const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { createSocketServer } = require("./socket");

connectDB();

const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const io = createSocketServer(httpServer, app.get("allowedOrigins") || []);

app.set("io", io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
