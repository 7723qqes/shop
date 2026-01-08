export async function onRequest({ request }: { request: Request }) {
  // 1. 请务必确认这两个值是正确的（从 Supabase 的 Settings -> API 获取）
  const SUPABASE_URL = "https://omsttjgrromkacdqrrkt.supabase.co"
  const SUPABASE_KEY = "sb_publishable_wHUdavd5QYTbh9FaFoFc1w_whBHN3Ur"

  const url = new URL(request.url)
  const category = url.searchParams.get("category")

  // 这里包含了 id, name, price, currency, stock, image_url 等所有字段
  let query = "is_active=eq.true&select=id,name,price,currency,stock,image_url,description,category"

  // 如果前端传了分类，就按分类过滤
  if (category && category !== '全部') {
    query += `&category=eq.${encodeURIComponent(category)}`
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?${query}`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60" 
      }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: "数据库连接失败" }), { status: 500 })
  }
}