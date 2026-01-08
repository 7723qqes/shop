export async function onRequest(context: { request: Request; env: any }) {
  const { request, env } = context;

  // 1. 从环境变量获取（请在 Pages 后台 Settings 绑定）
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_KEY = env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: "Missing Environment Variables" }), { status: 500 });
  }

  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const id = url.searchParams.get("id");

  // 2. 基础查询条件
  // 加上 order=id.asc 保证列表排序稳定
  let query = "is_active=eq.true&select=id,name,price,currency,stock,image_url,description,category&order=id.asc";

  // 3. 动态过滤逻辑
  if (id) {
    // 如果有 ID，说明是详情页请求
    query = `id=eq.${id}&select=id,name,price,currency,stock,image_url,description,category`;
  } else if (category && category !== '全部') {
    // 如果有分类，说明是分类筛选
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

    // 4. 优化缓存策略
    // 列表页缓存 60秒，单商品详情页缓存 1小时（因为详情变动通常较慢）
    const cacheTime = id ? "3600" : "60";

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${cacheTime}`,
        "Access-Control-Allow-Origin": "*" // 如果需要跨域
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Database Connection Error" }), { status: 500 });
  }
}