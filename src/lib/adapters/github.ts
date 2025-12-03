import { BaseAdapter } from './base';
import { GitHubAppData, GitHubRepo } from '@/types';

/**
 * GitHub数据适配器
 * 处理从GitHub导出的数据
 */
export class GitHubAdapter extends BaseAdapter<GitHubAppData> {
  constructor() {
    super('github');
  }

  /**
   * 从上传的JSON文件中解析GitHub数据
   */
  async parseFromFile(file: File): Promise<GitHubAppData> {
    const text = await file.text();
    const json = JSON.parse(text);
    return this.parseFromJSON(json);
  }

  /**
   * 从JSON对象中解析数据
   */
  parseFromJSON(json: any): GitHubAppData {
    if (!this.validate(json)) {
      throw new Error('Invalid GitHub data format');
    }

    return {
      id: this.generateId(),
      type: 'github',
      name: 'GitHub',
      icon: '/icons/github.svg',
      content: {
        repos: this.parseRepos(json.repos || json),
      },
      metadata: this.createMetadata(),
    };
  }

  /**
   * 验证数据格式
   */
  validate(data: any): boolean {
    // 检查是否是数组或者有repos属性
    const repos = data.repos || data;
    if (!Array.isArray(repos)) return false;

    // 检查每个repo是否有必要的字段
    return repos.every((repo: any) => repo.name && typeof repo.name === 'string');
  }

  /**
   * 解析仓库列表
   */
  private parseRepos(repos: any[]): GitHubRepo[] {
    return repos.map((repo) => ({
      id: repo.id || repo.name,
      name: repo.name,
      description: repo.description || '',
      url: repo.url || repo.html_url || `https://github.com/${repo.full_name || repo.name}`,
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count || repo.stars || 0,
      files: repo.files || [],
    }));
  }
}
