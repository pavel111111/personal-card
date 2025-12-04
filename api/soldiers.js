let soldiers = new Map(); // тимчасове зберігання в пам'яті (локально)

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;
      if (!data || !data.personal_number) {
        return res.status(400).json({ success: false, error: "Missing personal_number" });
      }

      // Зберігаємо об'єкт у Map
      soldiers.set(data.personal_number, data);

      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  } 
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
