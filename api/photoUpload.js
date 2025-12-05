import pool from "./db.js";

// Manual multipart/form-data parser (no Multer on Vercel)
async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    try {
      let data = Buffer.from([]);

      req.on("data", chunk => {
        data = Buffer.concat([data, chunk]);
      });

      req.on("end", () => {
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export const config = {
  api: {
    bodyParser: false, // Required for raw file upload
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const soldierId = req.query.id;

    if (!soldierId) {
      return res.status(400).json({ success: false, error: "Missing id" });
    }

    // Read raw multipart body
    const rawBody = await parseMultipart(req);

    if (!rawBody || rawBody.length === 0) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    // Extract file using boundary
    const contentType = req.headers["content-type"];
    const boundary = contentType.split("boundary=")[1];

    const parts = rawBody
      .toString()
      .split(`--${boundary}`)
      .filter(p => p.includes("filename"));

    if (parts.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid file payload" });
    }

    const filePart = parts[0];

    // Extract MIME
    const mimeMatch = filePart.match(/Content-Type: (.*)/);
    const mimeType = mimeMatch ? mimeMatch[1].trim() : "image/jpeg";

    // Extract binary data
    const start = filePart.indexOf("\r\n\r\n") + 4;
    const end = filePart.lastIndexOf("\r\n");
    const fileBuffer = Buffer.from(filePart.substring(start, end), "binary");

    // Detect Vercel URL (dynamic)
const host = req.headers["x-forwarded-host"] || req.headers.host;
const protocol = req.headers["x-forwarded-proto"] || "https";
const baseUrl = `${protocol}://${host}`;

const photoUrl = `${baseUrl}/api/photo?id=${soldierId}`;

    // Save into DB
    await pool.query(
      `INSERT INTO personal_photos (person_id, photo, mime_type, photo_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (person_id)
       DO UPDATE SET photo=$2, mime_type=$3, photo_url=$4`,
      [soldierId, fileBuffer, mimeType, photoUrl]
    );

    return res.status(200).json({
      success: true,
      photoUrl: photoUrl,
    });

  } catch (err) {
    console.error("PHOTO UPLOAD ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
