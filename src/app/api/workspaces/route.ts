import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';
import { getPublicRepository } from '@/lib/showcase/repository-service';
import { createWorkspaceSession, isWorkspaceSessionStorageConfigured, recentWorkspaceRequestCount, updateWorkspaceSession } from '@/lib/showcase/workspace-session-service';
import { provisionWorkspace } from '@/lib/showcase/workspace-provider';

function parseGitHubRepository(value: string): { owner: string; repo: string } | null {
  const normalized = value
    .replace(/^git@github\.com:/, '')
    .replace(/^https?:\/\/github\.com\//, '')
    .replace(/\.git$/, '')
    .trim();
  const match = normalized.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

async function authenticatedGitHub() {
  const token = (await cookies()).get('github_token')?.value;
  if (!token) return null;
  const octokit = new Octokit({ auth: token });
  const { data: user } = await octokit.users.getAuthenticated();
  return { token, octokit, user };
}

async function ensureFork(
  octokit: Octokit,
  login: string,
  upstream: { owner: string; repo: string }
) {
  try {
    const { data } = await octokit.repos.get({ owner: login, repo: upstream.repo });
    if (data.fork && data.parent?.full_name === `${upstream.owner}/${upstream.repo}`) return data;
  } catch (error: unknown) {
    if (!(error && typeof error === 'object' && 'status' in error && error.status === 404)) throw error;
  }

  await octokit.repos.createFork({ owner: upstream.owner, repo: upstream.repo });
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    try {
      const { data } = await octokit.repos.get({ owner: login, repo: upstream.repo });
      if (data.fork && data.parent?.full_name === `${upstream.owner}/${upstream.repo}`) return data;
    } catch {
      // Fork creation is asynchronous. The next bounded poll will retry.
    }
  }
  throw new Error('Fork is still being prepared. Please try again in a moment.');
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticatedGitHub();
    if (!auth) return NextResponse.json({ success: false, error: 'GitHub login required' }, { status: 401 });

    const body = await request.json();
    const projectSlug = typeof body.projectSlug === 'string' ? body.projectSlug : '';
    const project = await getPublicRepository(projectSlug);
    if (!project || !project.allowContributions || !project.gitRepo) {
      return NextResponse.json({ success: false, error: 'This repository does not accept contributions' }, { status: 404 });
    }
    if (!isWorkspaceSessionStorageConfigured()) {
      return NextResponse.json({ success: false, error: 'Workspace sessions are not configured' }, { status: 503 });
    }

    const hourlyLimit = Math.max(1, Number.parseInt(process.env.WORKSPACE_MAX_REQUESTS_PER_HOUR || '3', 10) || 3);
    const requestedRecently = await recentWorkspaceRequestCount(auth.user.login, new Date(Date.now() - 60 * 60 * 1000));
    if (requestedRecently >= hourlyLimit) {
      return NextResponse.json({ success: false, error: 'Workspace request limit reached. Please try again later.' }, { status: 429 });
    }

    const upstream = parseGitHubRepository(project.gitRepo);
    if (!upstream) {
      return NextResponse.json({ success: false, error: 'The repository is not a supported GitHub source' }, { status: 422 });
    }

    const fork = await ensureFork(auth.octokit, auth.user.login, upstream);
    const branchName = `showcase/${randomUUID().slice(0, 8)}`;
    const ref = await auth.octokit.git.getRef({
      owner: auth.user.login,
      repo: upstream.repo,
      ref: `heads/${fork.default_branch}`,
    });
    await auth.octokit.git.createRef({
      owner: auth.user.login,
      repo: upstream.repo,
      ref: `refs/heads/${branchName}`,
      sha: ref.data.object.sha,
    });

    const session = await createWorkspaceSession({
      projectId: project.id,
      projectSlug: project.slug,
      githubLogin: auth.user.login,
      forkRepository: `${auth.user.login}/${upstream.repo}`,
      branchName,
    });

    try {
      const provisioned = await provisionWorkspace({
        workspaceId: session.id,
        githubLogin: auth.user.login,
        forkRepository: `${auth.user.login}/${upstream.repo}`,
        branchName,
        projectSlug: project.slug,
      });
      const active = await updateWorkspaceSession(session.id, {
        status: 'provisioned',
        workspaceUrl: provisioned.workspaceUrl,
        expiresAt: provisioned.expiresAt,
        failureReason: null,
      });
      return NextResponse.json({ success: true, data: active }, { status: 201 });
    } catch (error) {
      const unavailable = await updateWorkspaceSession(session.id, {
        status: 'fork_ready',
        workspaceUrl: null,
        expiresAt: null,
        failureReason: error instanceof Error ? error.message : 'Workspace provisioning failed',
      });
      return NextResponse.json({ success: true, data: unavailable }, { status: 202 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to create workspace' },
      { status: 500 }
    );
  }
}
