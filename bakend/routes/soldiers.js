import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/soldiers", async (req, res) => {
  try {
    const data = req.body;

    if (!data || !data.personal_number) {
      return res
        .status(400)
        .json({ success: false, error: "Missing personal_number" });
    }

    // Якщо фото прийшло як dataURL – розбиваємо на mime + base64
    if (typeof data.photo === "string" && data.photo.startsWith("data:")) {
      const match = data.photo.match(/^data:(.*?);base64,(.*)$/);
      if (match) {
        const [, mime, base64] = match;
        data.photo_mime = mime;
        data.photo = base64;
      }
    }

    await pool.query(
      `
       SELECT save_personal_data($1::JSONB);
      `,
      [JSON.stringify(data)]
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("ERROR in /api/soldiers:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
});

export default router;
