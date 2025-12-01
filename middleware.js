// middleware.js

// 配置你的访问密码
const PASSWORD = "123456";

export function middleware(req) {
  const url = new URL(req.url);

  // 如果 cookie 中有 token，则允许访问
  const cookie = req.cookies.get("token");
  if (cookie && cookie === PASSWORD) {
    return; // 继续执行，不拦截
  }

  // 如果带了正确的 ?password=xxx，则设置 cookie
  const inputPassword = url.searchParams.get("password");
  if (inputPassword === PASSWORD) {
    const res = Response.redirect(url.origin + url.pathname);
    // 设置 7 天有效期
    res.headers.append(
      "Set-Cookie",
      `token=${PASSWORD}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}`
    );
    return res;
  }

  // 未验证，显示密码输入页
  return new Response(
    `
      <!DOCTYPE html>
      <html>
        <body style="font-family: sans-serif; padding: 40px;">
          <h2>请输入访问密码</h2>
          <form method="GET">
            <input 
              type="password" 
              name="password"
              placeholder="密码"
              style="padding: 8px; font-size: 16px;"
            />
            <button 
              style="padding: 8px 16px; font-size: 16px; margin-left: 10px;"
              type="submit"
            >
              进入
            </button>
          </form>
        </body>
      </html>
    `,
    { headers: { "Content-Type": "text/html" } }
  );
}

export const config = {
  // 要保护的路径，这里是全部路径
  matcher: ["/:path*"]
};
