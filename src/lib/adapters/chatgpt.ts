import { BaseAdapter } from './base';
import { ChatGPTAppData, ChatGPTConversation, ChatGPTMessage } from '@/types';

/**
 * ChatGPT数据适配器
 * 处理从ChatGPT导出的对话数据
 */
export class ChatGPTAdapter extends BaseAdapter<ChatGPTAppData> {
  constructor() {
    super('chatgpt');
  }

  /**
   * 从上传的JSON文件中解析ChatGPT数据
   */
  async parseFromFile(file: File): Promise<ChatGPTAppData> {
    const text = await file.text();
    const json = JSON.parse(text);
    return this.parseFromJSON(json);
  }

  /**
   * 从JSON对象中解析数据
   */
  parseFromJSON(json: any): ChatGPTAppData {
    if (!this.validate(json)) {
      throw new Error('Invalid ChatGPT data format');
    }

    return {
      id: this.generateId(),
      type: 'chatgpt',
      name: 'ChatGPT',
      icon: '/icons/chatgpt.svg',
      content: {
        conversations: this.parseConversations(json.conversations || json),
      },
      metadata: this.createMetadata(),
    };
  }

  /**
   * 验证数据格式
   */
  validate(data: any): boolean {
    const conversations = data.conversations || data;
    if (!Array.isArray(conversations)) return false;

    return conversations.every(
      (conv: any) => conv.title && Array.isArray(conv.mapping || conv.messages)
    );
  }

  /**
   * 解析对话列表
   */
  private parseConversations(conversations: any[]): ChatGPTConversation[] {
    return conversations.map((conv) => ({
      id: conv.id || conv.conversation_id || this.generateId(),
      title: conv.title,
      messages: this.parseMessages(conv.mapping || conv.messages),
      createdAt: new Date(conv.create_time || conv.createdAt || Date.now()),
    }));
  }

  /**
   * 解析消息列表
   */
  private parseMessages(mapping: any): ChatGPTMessage[] {
    // ChatGPT导出格式可能是mapping对象或messages数组
    let messages: any[] = [];

    if (Array.isArray(mapping)) {
      messages = mapping;
    } else if (typeof mapping === 'object') {
      // mapping格式转换为数组
      messages = Object.values(mapping)
        .filter((node: any) => node.message?.content?.parts)
        .map((node: any) => ({
          role: node.message.author.role,
          content: node.message.content.parts.join('\n'),
          timestamp: node.message.create_time,
        }));
    }

    return messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content || msg.text || '',
      timestamp: new Date(msg.timestamp || msg.create_time || Date.now()),
    }));
  }
}
