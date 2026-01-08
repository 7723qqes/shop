export async function onRequest({ request }: { request: Request }) {
  // 1. 替换为你的真实 URL
  const SUPABASE_URL = "https://omsttjgrromkacdqrrkt.supabase.co"
  
  // 2. 替换为那个超级长的 anon public key
  const SUPABASE_KEY = "sb_publishable_wHUdavd5QYTbh9FaFoFc1w_whBHN3Ur"

  const url = new URL(request.url)
  const category = url.searchParams.get("category")

  // 确保 select 包含了所有字段，包括 stock
  let query = "is_active=eq.true&select=id,name,price,currency,stock,image_url,description,category"

  if (category && category !== '全部') {
    query += `&category=eq.${encodeURIComponent(category)}`
  }

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
      "Cache-Control": "public, max-age=60" // 缩短缓存，方便调试
    }
  })
}