import pool from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { dog_tag } = req.query || {};

    if (!dog_tag) {
      return res
        .status(400)
        .json({ success: false, error: "Missing dog_tag" });
    }

    const result = await pool.query(
      `
    SELECT  p.data || jsonb_build_object('photo', 'data:image/jpeg;base64,' || encode(pp.photo, 'base64')
     ) AS data FROM personals p LEFT JOIN personal_photos pp ON pp.person_id = p.id
    WHERE dog_tag = $1;
      `,
      [dog_tag]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Person not found" });
    }

    const soldier = result.rows[0].data;

    return res.status(200).json({
      success: true,
      data: {
        data: soldier,
      },
    });
  } catch (err) {
    console.error("ERROR in /api/person:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
}
