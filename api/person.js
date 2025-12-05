import pool from "./db.js"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { dog_tag } = req.query;

    if (!dog_tag) {
      return res.status(400).json({
        success: false,
        error: "Missing dog_tag"
      });
    }

    const sql = `
      SELECT 
        p.data || jsonb_build_object('photoUrl', pp.photo_url) AS data
      FROM personals p
      LEFT JOIN personal_photos pp ON p.id = pp.person_id
      WHERE p.dog_tag = $1
    `;

    const result = await pool.query(sql, [dog_tag]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Person not found"
      });
    }

    const soldier = result.rows[0].data;

    return res.status(200).json({
      success: true,
      data: { data: soldier }
    });

  } catch (err) {
    console.error("ERROR in /api/person:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server error"
    });
  }
}
