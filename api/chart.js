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
    const tzRes = await fetch(`https://api.bodygraphchart.com/v210502/locations?api_key=${apiKey}&query=${encodeURIComponent(city)}`);
    const tzData = await tzRes.json();
    const timezone = tzData[0]?.timezone || 'UTC';
    const datetime = `${date} ${time}`;
    const hdRes = await fetch(`https://api.bodygraphchart.com/v221006/hd-data?api_key=${apiKey}&date=${encodeURIComponent(datetime)}&timezone=${encodeURIComponent(timezone)}`);
    if (!hdRes.ok) return res.status(hdRes.status).json({ error: await hdRes.text() });
    return res.status(200).json(await hdRes.json());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
