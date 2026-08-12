require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"])

connectDB();

const PORT = 5000 || process.env.PORT
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})