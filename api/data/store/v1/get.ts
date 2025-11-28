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

    const clonedReq = req.clone();
    const text = await clonedReq.text();
    const bodyData = text && text.length > 0 ? JSON.parse(text) : {};

    console.log('Body received:', Object.keys(bodyData).length, 'keys');

    const targetUrl = `https://api-production.creao.ai/data/store/v1/get?creao_access_token=${token}`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('Error:', err.message);
    
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
