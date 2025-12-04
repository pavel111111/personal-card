import express from "express";
import cors from "cors";
import { Pool } from "pg";
import loginRoute from "./routes/login.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ─────────────────────────────────────────────
// PostgreSQL
// ─────────────────────────────────────────────
export const pool = new Pool({
  host: "ec2-13-49-243-0.eu-north-1.compute.amazonaws.com",
  user: "kpv",
  password: "tomcat",
  database: "sdk_3101",
  port: 5454,
});

// ─────────────────────────────────────────────
// Login route
// ─────────────────────────────────────────────
app.use("/api", loginRoute);

// ─────────────────────────────────────────────
// Protected routes
// ─────────────────────────────────────────────
app.post("/api/soldiers", authMiddleware, async (req, res) => {
  try {
    const soldierData = req.body;

    const result = await pool.query(
      `SELECT save_personal_data($1) AS data`,
      [soldierData]
    );

    const data = result.rows[0].data;
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;

    if (parsedData.status === "ok") {
      res.json({ success: true, data: parsedData });
    } else {
      res.status(400).json({
        success: false,
        error: parsedData.message || "Помилка на сервері",
        data: parsedData,
      });
    }
  } catch (err) {
    console.error("ERROR in /api/soldiers:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET person by dog_tag (protected)
app.get("/api/person", authMiddleware, async (req, res) => {
  const dog_tag = req.query.dog_tag;

  try {
    const result = await pool.query(
      `SELECT 
         p.data || jsonb_build_object('photo', encode(pp.photo, 'base64')) AS data
       FROM personals p
       LEFT JOIN personal_photos pp ON pp.person_id = p.id
       WHERE dog_tag = $1;`,
      [dog_tag]
    );

    if (!result.rows.length) {
      return res.json({ success: false, error: "Not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("ERROR in /api/person:", err);
    res.json({ success: false, error: err.message });
  }
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
