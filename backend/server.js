import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cron from "node-cron";
import { sendDeadlineReminders } from "./controllers/taskController.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Run every hour to check for tasks due in the next 24 hours
cron.schedule("0 * * * *", () => {
  sendDeadlineReminders();
});

// Initialize app
const app = express();
const PORT = 8000;

dotenv.config();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming request bodies

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/tasks", taskRoutes); // Task management routes

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
