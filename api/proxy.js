export default async function handler(req, res) {
  // Set CORS headers FIRST
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse query parameters
    const { target, creao_access_token, ...otherParams } = req.query;
    
    if (!target) {
      return res.status(400).json({ error: 'Missing target parameter' });
    }

    // Build target URL with token
    const targetUrl = `https://api-production.creao.ai/${target}?creao_access_token=${creao_access_token}`;

    console.log('🔍 Proxying to:', targetUrl);
    console.log('📦 Method:', req.method);
    console.log('📦 Body:', req.body);

    // Forward request
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add body for POST/PUT/PATCH
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    console.log('📡 Response status:', response.status);

    // Get response data
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log('✅ Response data:', data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy request failed',
      details: error.message 
    });
  }
}
