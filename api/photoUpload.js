import pool from "./db.js";

export const config = {
  api: { bodyParser: false }, // потрібно для файлів
};

// зчитуємо raw multipart payload
async function readBody(req) {
  return new Promise((resolve) => {
    let data = [];
    req.on("data", chunk => data.push(chunk));
    req.on("end", () => resolve(Buffer.concat(data)));
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  // ID передається НЕ в URL, а в FormData
  const soldierId = req.query.id || req.headers["x-soldier-id"];
  if (!soldierId) {
    return res.status(400).json({ success: false, error: "Missing id" });
  }

  const raw = await readBody(req);
  const contentType = req.headers["content-type"];
  const boundary = contentType.split("boundary=")[1];

  const parts = raw.toString().split(`--${boundary}`);
  const filePart = parts.find(p => p.includes("filename"));
  if (!filePart) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  const mimeMatch = filePart.match(/Content-Type: (.*)/);
  const mimeType = mimeMatch ? mimeMatch[1].trim() : "image/jpeg";

  const start = filePart.indexOf("\r\n\r\n") + 4;
  const end = filePart.lastIndexOf("\r\n");
  const fileBuffer = Buffer.from(filePart.substring(start, end), "binary");

  // Домен Vercel
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const baseUrl = `${protocol}://${host}`;

  const photoUrl = `${baseUrl}/api/photo?id=${soldierId}`;

  await pool.query(
    `INSERT INTO personal_photos (person_id, photo, mime_type, photo_url)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (person_id)
     DO UPDATE SET photo=$2, mime_type=$3, photo_url=$4`,
    [soldierId, fileBuffer, mimeType, photoUrl]
  );

  return res.json({ success: true, photoUrl });
}
