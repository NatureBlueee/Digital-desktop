import { NextRequest, NextResponse } from 'next/server';

/**
 * GitHub OAuth 登录入口
 * 重定向用户到 GitHub 授权页面
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub OAuth not configured' },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://your-domain.com'
      : 'http://localhost:3000');

  const redirectUri = `${baseUrl}/api/auth/github/callback`;

  // 请求 public_repo 权限用于 fork 和创建 PR
  const scope = 'public_repo';

  // 可选：传递 state 参数用于防止 CSRF 攻击
  const state = request.nextUrl.searchParams.get('state') || '';

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  if (state) {
    authUrl.searchParams.set('state', state);
  }

  return NextResponse.redirect(authUrl.toString());
}
