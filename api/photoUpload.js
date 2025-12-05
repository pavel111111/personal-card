import pool from "./db.js";

export const config = {
  api: { bodyParser: false }, 
};

async function readBody(req) {
  return new Promise(resolve => {
    let data = [];
    req.on("data", chunk => data.push(chunk));
    req.on("end", () => resolve(Buffer.concat(data)));
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const soldierId = req.query.id;
  if (!soldierId) {
    return res.status(400).json({ success: false, error: "Missing id" });
  }

  const raw = await readBody(req);
  const contentType = req.headers["content-type"];
  const boundary = contentType.split("boundary=")[1];

  const parts = raw.toString().split(`--${boundary}`);
  const filePart = parts.find(p => p.includes("filename"));
  if (!filePart) return res.status(400).json({ success: false, error: "No file uploaded" });

  const mimeMatch = filePart.match(/Content-Type: (.*)/);
  const mimeType = mimeMatch ? mimeMatch[1].trim() : "image/jpeg";

  const start = filePart.indexOf("\r\n\r\n") + 4;
  const end = filePart.lastIndexOf("\r\n");
  const fileBuffer = Buffer.from(filePart.substring(start, end), "binary");

  // Build correct absolute URL (works on Vercel and local)
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const baseUrl = `${protocol}://${host}`;

  const photoUrl = `${baseUrl}/api/photoUpload?id=${soldierId}`;

  await pool.query(
    `INSERT INTO personal_photos (person_id, photo, mime_type, photo_url)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (person_id)
     DO UPDATE SET photo=$2, mime_type=$3, photo_url=$4`,
    [soldierId, fileBuffer, mimeType, photoUrl]
  );

  return res.status(200).json({ success: true, photoUrl });
}
