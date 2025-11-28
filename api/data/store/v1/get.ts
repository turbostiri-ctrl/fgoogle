export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const creao_access_token = url.searchParams.get('creao_access_token');

    if (!creao_access_token) {
      return new Response(
        JSON.stringify({ error: 'Missing token' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Read body
    const body = await req.json();

    console.log('GET - Body:', JSON.stringify(body, null, 2));

    const targetUrl = `https://api-production.creao.ai/data/store/v1/get?creao_access_token=${creao_access_token}`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('GET - Response:', response.status, data);

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error('GET - Error:', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
