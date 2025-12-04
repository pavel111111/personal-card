import soldiers from "./soldiers.js"; // або той же Map в одному файлі, якщо не хочеш імпорту

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { dog_tag } = req.query;
  if (!dog_tag) return res.status(400).json({ success: false, error: "Missing dog_tag" });

  const soldier = soldiers.get(dog_tag);
  if (!soldier) return res.status(404).json({ success: false, error: "Person not found" });

  return res.status(200).json({ success: true, data: soldier });
}
