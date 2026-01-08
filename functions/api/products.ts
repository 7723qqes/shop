export async function onRequest({ request }: { request: Request }) {
  const SUPABASE_URL = "https://omsttjgrromkacdqrrkt.supabase.co"
  const SUPABASE_KEY = "sb_publishable_wHUdavd5QYTbh9FaFoFc1w_whBHN3Ur"

  const url = new URL(request.url)
  const category = url.searchParams.get("category")

  let query =
    "is_active=eq.true&select=id,name,price,currency,stock,image_url,description,category"

  if (category) {
    query += `&category=eq.${encodeURIComponent(category)}`
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?${query}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    }
  )

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300"
    }
  })
}
