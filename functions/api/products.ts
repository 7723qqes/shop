/**
 * Universal Backend V2.0
 * 说明：这是一个容错性极强的后端，可以处理任意类型的 price 字段
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  // 构建 Supabase 客户端
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY;

  // 简单的 CORS 头，允许网页跨域访问
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache" // 禁用 API 缓存，确保数据最新
  };

  try {
    let queryUrl = `${supabaseUrl}/rest/v1/products`;
    
    // 如果有 ID，就只查那一个；没有 ID，就查全部
    if (id) {
      queryUrl += `?id=eq.${id}&select=*`;
    } else {
      queryUrl += `?select=*&order=id.desc`; // 按 ID 倒序排列，新录入的在前面
    }

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`DB Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), { headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers 
    });
  }
}