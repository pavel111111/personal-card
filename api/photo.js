import pool from "./db.js"; 

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { id } = req.query;

  try {
    const result = await pool.query(
      `SELECT photo, mime_type 
       FROM personal_photos 
       WHERE person_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).end();
    }

    const { photo, mime_type } = result.rows[0];

    // Правильні заголовки для двійкових даних
    res.setHeader("Content-Type", mime_type || "image/jpeg");
    res.setHeader("Content-Length", photo.length);

    // ВІДДАЄМО БУФЕР — не JSON!
    return res.status(200).send(photo);

  } catch (e) {
    console.error("PHOTO ERROR:", e);
    return res.status(500).end("Server error");
  }
}
