// routes/login.js або api/login.js для Vercel
import { pool } from "../index.js"; // твоя база
import jwt from "jsonwebtoken";
import express from "express";

const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ success: false, error: "Login or password missing" });
  }

  try {
    // Перевірка користувача через PostgreSQL crypt()
    const result = await pool.query(
      `SELECT id, user_name
       FROM app_users
       WHERE user_name = $1
       AND password_hash = crypt($2, password_hash)`,
      [login, password]
    );

    if (!result.rows.length) {
      return res.status(401).json({ success: false, error: "Wrong login or password" });
    }

    const user = result.rows[0];

    // Генерація JWT
    const token = jwt.sign(
      { userId: user.id, login: user.user_name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
