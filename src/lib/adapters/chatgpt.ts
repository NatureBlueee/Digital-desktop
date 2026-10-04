import { BaseAdapter } from './base';
import { ChatGPTAppData, ChatGPTConversation, ChatGPTMessage } from '@/types';

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function conversationList(data: unknown): unknown {
  return isRecord(data) ? data.conversations : data;
}

function isConversation(value: unknown): value is RecordValue & { title: string } {
  return isRecord(value) && typeof value.title === 'string' && value.title.length > 0
    && (Array.isArray(value.messages) || Array.isArray(value.mapping) || isRecord(value.mapping));
}

function parseDate(value: unknown): Date {
  // Export timestamps are Unix seconds; normalized app timestamps may be ISO strings or milliseconds.
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(Math.abs(value) < 1e11 ? value * 1000 : value);
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date();
}

/** Parses both ChatGPT exports and normalized conversation arrays. */
export class ChatGPTAdapter extends BaseAdapter<ChatGPTAppData> {
  constructor() {
    super('chatgpt');
  }

  async parseFromFile(file: File): Promise<ChatGPTAppData> {
    const json: unknown = JSON.parse(await file.text());
    return this.parseFromJSON(json);
  }

  parseFromJSON(json: unknown): ChatGPTAppData {
    const conversations = conversationList(json);
    if (!Array.isArray(conversations) || !conversations.every(isConversation)) {
      throw new Error('Invalid ChatGPT data format');
    }
    return {
      id: this.generateId(),
      type: 'chatgpt',
      name: 'ChatGPT',
      icon: '/icons/chatgpt.svg',
      content: { conversations: conversations.map((conversation) => this.parseConversation(conversation)) },
      metadata: this.createMetadata(),
    };
  }

  validate(data: unknown): boolean {
    const conversations = conversationList(data);
    return Array.isArray(conversations) && conversations.every(isConversation);
  }

  private parseConversation(conversation: RecordValue & { title: string }): ChatGPTConversation {
    const id = conversation.id ?? conversation.conversation_id;
    return {
      id: typeof id === 'string' && id ? id : this.generateId(),
      title: conversation.title,
      messages: this.parseMessages(conversation.mapping ?? conversation.messages),
      createdAt: parseDate(conversation.create_time ?? conversation.createdAt),
    };
  }

  private parseMessages(mapping: unknown): ChatGPTMessage[] {
    let messages: RecordValue[] = [];
    if (Array.isArray(mapping)) {
      messages = mapping.filter(isRecord);
    } else if (isRecord(mapping)) {
      messages = Object.values(mapping).flatMap((node) => {
        if (!isRecord(node) || !isRecord(node.message)) return [];
        const message = node.message;
        if (!isRecord(message.content) || !Array.isArray(message.content.parts)) return [];
        return [{
          role: isRecord(message.author) ? message.author.role : undefined,
          content: message.content.parts.filter((part): part is string => typeof part === 'string').join('\n'),
          timestamp: message.create_time,
        }];
      });
    }
    return messages.map((message) => ({
      role: message.role === 'user' ? 'user' : 'assistant',
      content: typeof message.content === 'string' ? message.content
        : typeof message.text === 'string' ? message.text : '',
      timestamp: parseDate(message.timestamp ?? message.create_time),
    }));
  }
}
