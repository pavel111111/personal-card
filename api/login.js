export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { login, password } = req.body;

  if (login === '1111' && password === '1111') {
    return res.status(200).json({ success: true, token: 'FAKE_JWT_TOKEN' });
  }

  return res.status(401).json({ success: false, error: 'Невірний логін або пароль' });
}
