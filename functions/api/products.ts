export async function onRequest(context: { request: Request; env: any }) {
  const { request, env } = context;

  // 从环境变量获取配置（确保你在 Cloudflare Pages 后台设置了这两个变量）
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_KEY = env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: "服务器配置缺失" }), { status: 500 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const category = url.searchParams.get("category");

  // 基础查询：只查上架商品，包含所有必要字段
  let query = "is_active=eq.true&select=id,name,price,currency,stock,image_url,description,category&order=id.asc";

  // 如果传了 ID，改为单商品查询
  if (id) {
    query = `id=eq.${id}&select=id,name,price,currency,stock,image_url,description,category`;
  } else if (category && category !== '全部') {
    query += `&category=eq.${encodeURIComponent(category)}`;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?${query}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1", // 这里改为 1 秒，解决更新慢的问题
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "数据库连接失败" }), { status: 500 });
  }
}