export async function onRequest() {
  const cache = caches.default
  await cache.delete(new Request("http://local/api/products"))
  return new Response("cache cleared")
}
