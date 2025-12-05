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

    const result = await pool.query(
      `
       SELECT save_personal_data($1::JSONB) AS out;
      `,
      [JSON.stringify(data)]
    );

    const out = result.rows[0]?.out;

    if (!out) {
      return res.status(500).json({
        success: false,
        error: "save_personal_data returned nothing"
      });
    }

    return res.status(200).json({
      success: true,
      data: out
    });

  } catch (err) {
    console.error("ERROR in /api/soldiers:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server error"
    });
  }
});

export default router;
