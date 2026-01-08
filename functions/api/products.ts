// 这是一个极简测试版，不调用数据库，直接返回测试文字
export async function onRequest() {
  const data = [{ name: "接口测试成功", price: 0, stock: 99 }];
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}