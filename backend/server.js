const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = http.createServer(app);
    const io = initSocket(server);

    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Socket.IO initialized with ${io.engine?.clientsCount ?? 0} connected clients`);
    });
  })
  .catch((error) => {
    console.error(`❌ Server startup failed: ${error.message}`);
    process.exit(1);
  });
