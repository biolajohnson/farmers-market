const express = require("express");
const connectDB = require("./config/db");

const app = express();
connectDB();
const port = process.env.PORT || 7000;
app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send("the farm api is working"));
//define routes
app.use("/api/users", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/userprofile", require("./routes/api/userProfile"));
app.use("/api/farmer", require("./routes/api/farmerProfile"));
app.use("/api/post", require("./routes/api/post"));

app.listen(port, () => {
  console.log("the server is up on port " + port);
});
