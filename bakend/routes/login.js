import { pool } from "../index.js";
import jwt from "jsonwebtoken";
import express from "express";

const SECRET_KEY = "my_secret_key";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ success: false, error: "Login or password missing" });
  }

  try {
    // Перевірка користувача і пароля через crypt()
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

    const token = jwt.sign(
      { userId: user.id, login: user.user_name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
