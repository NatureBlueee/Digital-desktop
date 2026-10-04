import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';
import { createShowcaseRepository, listPublicRepositories } from '@/lib/showcase/repository-service';

async function currentGitHubUser() {
  const token = (await cookies()).get('github_token')?.value;
  if (!token) return null;
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.users.getAuthenticated();
  return data;
}

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: await listPublicRepositories() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to list repositories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentGitHubUser();
    if (!user || user.login !== process.env.SHOWCASE_OWNER_GITHUB_LOGIN) {
      return NextResponse.json({ success: false, error: 'Owner authorization required' }, { status: 403 });
    }

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';
    const gitRepo = typeof body.gitRepo === 'string' ? body.gitRepo.trim() : '';
    const snapshotRef = typeof body.snapshotRef === 'string' ? body.snapshotRef.trim() : '';

    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !gitRepo || !snapshotRef) {
      return NextResponse.json({ success: false, error: 'name, slug, gitRepo and snapshotRef are required' }, { status: 400 });
    }

    const repository = await createShowcaseRepository({
      name,
      slug,
      gitRepo,
      snapshotRef,
      description: typeof body.description === 'string' ? body.description.trim() : undefined,
      readonlyIdeUrl: typeof body.readonlyIdeUrl === 'string' ? body.readonlyIdeUrl.trim() : undefined,
      allowContributions: body.allowContributions === true,
    });

    return NextResponse.json({ success: true, data: repository }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to import repository' },
      { status: 500 }
    );
  }
}
