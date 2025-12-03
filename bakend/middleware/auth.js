import jwt from "jsonwebtoken";

const SECRET_KEY = "my_super_secret_key"; // заміни на щось своє

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, error: "Invalid token" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Token invalid" });
  }
}
