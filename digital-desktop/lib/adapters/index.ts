import { BaseAdapter } from './base';
import { GitHubAdapter } from './github';
import { ChatGPTAdapter } from './chatgpt';
import { AppType } from '@/types';

/**
 * 获取指定类型的适配器
 */
export function getAdapter(type: AppType): BaseAdapter {
  switch (type) {
    case 'github':
      return new GitHubAdapter();
    case 'chatgpt':
      return new ChatGPTAdapter();
    // 其他适配器可以后续添加
    default:
      throw new Error(`Adapter for type "${type}" not implemented yet`);
  }
}

export { BaseAdapter, GitHubAdapter, ChatGPTAdapter };
