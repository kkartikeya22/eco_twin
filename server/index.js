import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import electricityRoutes from "./routes/electricityRoutes.js";
import travelRoutes from "./routes/travelRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "EcoTwin API Running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/receipts", receiptRoutes);

app.use("/api/food", foodRoutes);

app.use("/api/electricity",electricityRoutes);

app.use("/api/travel", travelRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/coach",coachRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});