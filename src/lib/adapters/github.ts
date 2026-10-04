import { BaseAdapter } from './base';
import { GitHubAppData, GitHubFile, GitHubRepo } from '@/types';

type RepositoryInput = Record<string, unknown> & { name: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function repositoryList(data: unknown): unknown {
  return isRecord(data) ? data.repos : data;
}

function isRepository(value: unknown): value is RepositoryInput {
  return isRecord(value) && typeof value.name === 'string' && value.name.length > 0;
}

function isFile(value: unknown): value is GitHubFile {
  return isRecord(value) && typeof value.path === 'string'
    && typeof value.content === 'string' && typeof value.language === 'string';
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value ? value : fallback;
}

/** Parses repository exports without trusting optional JSON fields. */
export class GitHubAdapter extends BaseAdapter<GitHubAppData> {
  constructor() {
    super('github');
  }

  async parseFromFile(file: File): Promise<GitHubAppData> {
    const json: unknown = JSON.parse(await file.text());
    return this.parseFromJSON(json);
  }

  parseFromJSON(json: unknown): GitHubAppData {
    const repos = repositoryList(json);
    if (!Array.isArray(repos) || !repos.every(isRepository)) {
      throw new Error('Invalid GitHub data format');
    }
    return {
      id: this.generateId(),
      type: 'github',
      name: 'GitHub',
      icon: '/icons/github.svg',
      content: { repos: repos.map((repo) => this.parseRepo(repo)) },
      metadata: this.createMetadata(),
    };
  }

  validate(data: unknown): boolean {
    const repos = repositoryList(data);
    return Array.isArray(repos) && repos.every(isRepository);
  }

  private parseRepo(repo: RepositoryInput): GitHubRepo {
    const stars = repo.stargazers_count ?? repo.stars;
    return {
      id: typeof repo.id === 'number' ? String(repo.id) : stringValue(repo.id, repo.name),
      name: repo.name,
      description: stringValue(repo.description),
      url: stringValue(repo.url, stringValue(repo.html_url, `https://github.com/${stringValue(repo.full_name, repo.name)}`)),
      language: stringValue(repo.language, 'Unknown'),
      stars: typeof stars === 'number' && Number.isFinite(stars) ? stars : 0,
      files: Array.isArray(repo.files) ? repo.files.filter(isFile) : [],
    };
  }
}
