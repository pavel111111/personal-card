import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/photo", async (req, res) => {
  const { id } = req.query;

  try {
    const result = await pool.query(
      `SELECT photo, mime_type FROM personal_photos WHERE person_id = $1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).end();
    }

    const { photo, mime_type } = result.rows[0];

    res.setHeader("Content-Type", mime_type || "image/jpeg");
    res.send(photo);
  } catch (e) {
    console.error("PHOTO ERROR:", e);
    res.status(500).end();
  }
});

export default router;
