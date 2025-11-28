export const runtime = 'edge';

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('creao_access_token');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing token' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Clone request to avoid consumption issues
    const clonedReq = req.clone();
    
    let body = {};
    
    // Only read body for POST requests
    if (req.method === 'POST') {
      try {
        const text = await clonedReq.text();
        console.log('Raw text length:', text.length);
        
        if (text && text.length > 0) {
          body = JSON.parse(text);
          console.log('Parsed body keys:', Object.keys(body));
        }
      } catch (parseErr) {
        console.error('Parse error:', parseErr.message);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON', details: parseErr.message }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    const targetUrl = `https://api-production.creao.ai/data/store/v1/get?creao_access_token=${token}`;

    console.log('Proxying to Creao API');

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('Creao response status:', res.status);

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('Handler error:', err.message);
    console.error('Stack:', err.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: err.message,
        stack: err.stack 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
