export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { date, time, city } = req.body;
  if (!date || !time || !city) return res.status(400).json({ error: 'Missing fields' });
  const apiKey = process.env.HD_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  try {
    const datetime = `${date}T${time}`;
    const response = await fetch('https://api.humandesignhub.app/v1/simple-bodygraph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
      body: JSON.stringify({ date, time, city, datetime })
    });
    if (!response.ok) return res.status(response.status).json({ error: await response.text() });
    return res.status(200).json(await response.json());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
