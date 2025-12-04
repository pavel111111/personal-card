import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
