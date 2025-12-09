import express from "express";
import multer from "multer";
import { pool } from "../db.js";

const router = express.Router();

// Зберігаємо файл у RAM (Buffer)
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/soldiers/photoUpload",
  upload.single("photo"),
  async (req, res) => {
    try {
      const soldierId = req.params.id;

      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }
      const BASE_API_URL = 'http://localhost:3001';
      const mime = req.file.mimetype;
      const buffer = req.file.buffer;
      const photoUrl = `${BASE_API_URL}/api/photo?id=${soldierId}`;

      await pool.query(        
        `INSERT INTO personal_photos (person_id, photo, mime_type, photo_url)
          VALUES ($1, $2, $3, $4) ON CONFLICT (person_id)
          DO UPDATE SET photo = $2, mime_type = $3, photo_url = $4;`,
        [soldierId, buffer, mime, photoUrl]
      );

      return res.json({
        success: true,
        photoUrl: photoUrl
      });
    } catch (err) {
      console.error("PHOTO UPLOAD ERROR:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

export default router;