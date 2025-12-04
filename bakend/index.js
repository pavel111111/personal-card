import express from "express";
import cors from "cors";
import loginRoute from "./routes/login.js";
import soldiersRoute from "./routes/soldiers.js";
import personRoute from "./routes/person.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

// JSON body
app.use(express.json({ limit: "10mb" }));

// Healthcheck
app.get("/", (req, res) => {
  res.json({ ok: true });
});

// Public route: login
app.use("/api", loginRoute);

// Protected routes: everything below requires valid JWT
app.use("/api", authMiddleware, soldiersRoute);
app.use("/api", authMiddleware, personRoute);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
