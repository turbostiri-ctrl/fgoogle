import getRawBody from 'raw-body';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { creao_access_token } = req.query;
  
  if (!creao_access_token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    // Read body manually
    const bodyBuffer = await getRawBody(req);
    const bodyText = bodyBuffer.toString('utf8');
    const bodyData = bodyText ? JSON.parse(bodyText) : {};

    const url = `https://api-production.creao.ai/data/store/v1/insert?creao_access_token=${creao_access_token}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
