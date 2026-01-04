import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GitHub OAuth 回调处理
 * 接收授权码并交换 access_token
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
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

  try {
    // 用授权码交换 access_token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub OAuth error:', tokenData);
      return NextResponse.json(
        { error: tokenData.error_description || 'Failed to get access token' },
        { status: 400 }
      );
    }

    const { access_token } = tokenData;

    if (!access_token) {
      return NextResponse.json(
        { error: 'No access token received' },
        { status: 400 }
      );
    }

    // 获取用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    // 存储 token 到 httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('github_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // 存储用户信息到另一个 cookie (可选，用于前端显示)
    cookieStore.set('github_user', JSON.stringify({
      login: userData.login,
      avatar_url: userData.avatar_url,
      name: userData.name,
    }), {
      httpOnly: false, // 允许前端访问
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    // 重定向回前端页面，可以添加成功消息
    const redirectUrl = new URL('/', baseUrl);
    redirectUrl.searchParams.set('github_auth', 'success');
    if (state) {
      redirectUrl.searchParams.set('state', state);
    }

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.json(
      { error: 'Failed to complete GitHub authentication' },
      { status: 500 }
    );
  }
}
