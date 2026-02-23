import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { query } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import balanceRoutes from "./routes/balance.js";
import { cleanupExpiredTokens } from "./scripts/cleanup-expired-tokens.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/*
========================================
   CORS CONFIG (PRODUCTION + LOCAL)
========================================
*/

const allowedOrigins = [
  "http://localhost:5173",
  "https://kod-banking.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/*
========================================
   MIDDLEWARE
========================================
*/

app.use(express.json());
app.use(cookieParser());

/*
========================================
   RATE LIMITING
========================================
*/

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts. Try again later." },
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

/*
========================================
   CLEANUP TASK
========================================
*/

setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

/*
========================================
   HEALTH CHECK
========================================
*/

app.get("/api/health", async (req, res) => {
  try {
    await query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message: err.message,
    });
  }
});

/*
========================================
   ROUTES
========================================
*/

app.use("/api/auth", authRoutes);
app.use("/api", balanceRoutes);

/*
========================================
   START SERVER
========================================
*/

app.listen(PORT, () => {
  console.log(`Kodbank API running on port ${PORT}`);
});
