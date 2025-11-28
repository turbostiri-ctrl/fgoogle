// Disable body parsing, we'll handle it manually
export const config = {
  api: {
    bodyParser: true,
  },
};

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
    const { target, creao_access_token } = req.query;
    
    if (!target) {
      console.error('❌ Missing target parameter');
      return res.status(400).json({ error: 'Missing target parameter' });
    }

    // Build target URL with token
    const targetUrl = `https://api-production.creao.ai/${target}?creao_access_token=${creao_access_token}`;

    console.log('🔍 Proxying to:', targetUrl);
    console.log('📦 Method:', req.method);
    console.log('📦 Request body:', req.body);

    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add body for POST/PUT/PATCH
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        // Body is already parsed by Vercel
        fetchOptions.body = JSON.stringify(req.body);
        console.log('📤 Sending body:', fetchOptions.body);
      } else {
        console.warn('⚠️ No body in request');
      }
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

    console.log('📥 Response data:', typeof data === 'string' ? data : JSON.stringify(data, null, 2));

    // If error, log it
    if (!response.ok) {
      console.error('❌ API Error:', data);
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy request failed',
      details: error.message,
      stack: error.stack
    });
  }
}
