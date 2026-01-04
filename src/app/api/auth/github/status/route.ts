import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * 检查 GitHub 认证状态
 * 返回当前登录的用户信息（如果已登录）
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;
  const userCookie = cookieStore.get('github_user')?.value;

  if (!token) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  // 如果有 user cookie，直接返回
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      return NextResponse.json({
        authenticated: true,
        user,
      });
    } catch {
      // 如果解析失败，继续从 GitHub API 获取
    }
  }

  // 验证 token 并获取用户信息
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      // Token 可能已过期或无效
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const userData = await response.json();

    return NextResponse.json({
      authenticated: true,
      user: {
        login: userData.login,
        avatar_url: userData.avatar_url,
        name: userData.name,
      },
    });
  } catch (error) {
    console.error('Failed to verify GitHub token:', error);
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }
}
