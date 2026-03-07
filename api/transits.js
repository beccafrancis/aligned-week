export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { date } = req.query;
  const apiKey = process.env.HD_API_KEY;

  try {
    const url = `https://api.bodygraphchart.com/v221006/hd-data?api_key=${apiKey}&date=${date}&timezone=UTC`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
