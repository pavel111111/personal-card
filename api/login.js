import jwt from "jsonwebtoken";

import pool from "./db.js";

const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { login, password } = req.body || {};

  if (!login || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Введіть логін і пароль" });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, user_name, full_name
      FROM app_users
      WHERE user_name = $1
        AND password_hash = crypt($2, password_hash)
      `,
      [login, password]
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, error: "Невірний логін або пароль" });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      {
        userId: user.id,
        login: user.user_name,
        fullName: user.full_name,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({ success: true,  token, user: {
              id: user.id,
              login: user.user_name,
              fullName: user.full_name
    }});
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Server error" });
  }
}
