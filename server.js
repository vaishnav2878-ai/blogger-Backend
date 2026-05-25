const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blogger-frontend-eight.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-viewed-blogs"],
}));

// Static folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});