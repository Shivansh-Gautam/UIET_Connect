require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const departmentRouter = require("./routers/department.router");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration (Allow frontend access)
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies & authorization headers
    allowedHeaders: ["Authorization", "Content-Type"],
    exposedHeaders: ["Authorization"], // Ensure frontend can access token
  })
);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/UIET-CONNECT";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/department", departmentRouter);

// Handle Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
