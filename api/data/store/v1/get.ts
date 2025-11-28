export const runtime = 'edge';

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('creao_access_token');

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Missing token' }),
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const text = await req.text();
    const body = text ? JSON.parse(text) : {};

    console.log('Body:', body);

    const targetUrl = `https://api-production.creao.ai/data/store/v1/get?creao_access_token=${token}`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('Response:', res.status);

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
