export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });
  try {
    const body = req.body;
    console.log('Request body:', JSON.stringify(body).slice(0, 200));
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        messages: body.messages || [{ role: 'user', content: body.prompt || JSON.stringify(body) }]
      })
    });
    const text = await response.text();
    console.log('Anthropic response status:', response.status);
    console.log('Anthropic response:', text.slice(0, 300));
    if (!response.ok) return res.status(response.status).json({ error: text });
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    console.log('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
