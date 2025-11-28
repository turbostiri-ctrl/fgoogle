// Disable automatic body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { creao_access_token } = req.query;
    
    if (!creao_access_token) {
      return res.status(400).json({ error: 'Missing creao_access_token' });
    }

    // Read body manually
    let body = '';
    for await (const chunk of req) {
      body += chunk.toString();
    }

    let parsedBody = {};
    try {
      parsedBody = body ? JSON.parse(body) : {};
    } catch (e) {
      console.error('Failed to parse body:', e);
      parsedBody = {};
    }

    const targetUrl = `https://api-production.creao.ai/data/store/v1/insert?creao_access_token=${creao_access_token}`;

    console.log('Proxying INSERT to:', targetUrl);
    console.log('Body:', JSON.stringify(parsedBody, null, 2));

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedBody),
    });

    const data = await response.json();
    
    console.log('Response:', response.status, data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy request failed',
      details: error.message
    });
  }
}
