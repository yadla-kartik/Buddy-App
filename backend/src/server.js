const dotenv = require("dotenv");
dotenv.config();
const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

connectDB();

const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
