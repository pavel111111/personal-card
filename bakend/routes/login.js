import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key";

router.post("/login", async (req, res) => {
  const { login, password } = req.body || {};

  if (!login || !password) {
    return res.status(400).json({ success: false, error: "Введіть логін і пароль" });
  }

  try {
    // 1. Знаходимо користувача по логіну
    const result = await pool.query(
      `SELECT id, user_name, full_name, password_hash FROM app_users WHERE user_name = $1`,
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: "Невірний логін або пароль" });
    }

    const user = result.rows[0];

    // 2. Перевіряємо пароль через bcrypt
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Невірний логін або пароль" });
    }

    // 3. Генеруємо токен
    const token = jwt.sign(
      { userId: user.id, login: user.user_name, fullName: user.full_name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
