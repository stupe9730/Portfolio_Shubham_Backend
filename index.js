const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const path = require("path");

mongoose.connect(process.env.MONGO_URL);
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static("uploads"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cors());
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/project", require("./routes/projectRoute"));

app.use("*", (req, res) => {
  res.status(404).json({ message: "Resource Not Found" });
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  // set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

mongoose.connection.once("open", () => {
  console.log("MONGO CONNECTED");
  app.listen(process.env.PORT, console.log("server running", process.env.PORT));
});
