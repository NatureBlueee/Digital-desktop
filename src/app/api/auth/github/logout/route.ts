import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GitHub 登出
 * 清除存储的 token 和用户信息
 */
export async function POST() {
  const cookieStore = await cookies();

  // 删除 token 和用户信息 cookies
  cookieStore.delete('github_token');
  cookieStore.delete('github_user');

  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
}
