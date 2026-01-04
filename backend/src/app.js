// Glavna Express aplikacija
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import appointmentsRoutes from "./routes/appointments.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Učitavanje .env fajla iz root foldera projekta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();

// Middleware-ovi
app.use(cors());
app.use(express.json());

// Rute
app.get("/", (req, res) => {
  res.json({ 
    message: "Frizerski Booking System API",
    version: "1.0.0",
    status: "running 🚀"
  });
});

// API rute
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

export default app;
