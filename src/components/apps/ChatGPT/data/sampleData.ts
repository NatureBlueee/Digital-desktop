import { ChatGPTConversation, ChatGPTMessage } from '@/types';

export interface HeroPrompt {
  title: string;
  subtitle: string;
  badge?: string;
}

export const heroPrompts: HeroPrompt[] = [
  {
    title: '整理凌乱的思路',
    subtitle: '从笔记、邮件和链接中自动生成清晰的摘要',
    badge: 'Instant Recall',
  },
  {
    title: '头脑风暴创意',
    subtitle: '为文章、视频或社交媒体准备 10 个新点子',
  },
  {
    title: '代码伙伴',
    subtitle: '解释代码、修复 Bug 或生成单元测试',
    badge: 'Dev Mode',
  },
  {
    title: '视觉创作',
    subtitle: '生成灵感情绪板或调整配色方案',
    badge: 'Vision',
  },
];

const snakeMessages: ChatGPTMessage[] = [
  {
    role: 'user',
    content: '分析一下蛇的象征意义，给我一个大纲。',
    timestamp: new Date('2024-08-19T09:00:00Z'),
  },
  {
    role: 'assistant',
    content:
      '当然可以！下面是一份关于“蛇的象征意义”的提纲，涵盖文化、心理学与现代语境：\n\n' +
      '1) 神话与宗教：\n' +
      '- 古希腊：医神杖上的蛇象征治愈与重生\n' +
      '- 《圣经》：伊甸园的蛇象征诱惑、智慧与危险的双重性\n' +
      '- 东方传统：灵性、守护与循环（蛇吞尾）\n\n' +
      '2) 心理学/原型：\n' +
      '- 荣格：无意识的能量、转化、恐惧与欲望的矛盾统一\n' +
      '- 阴影与重生：蜕皮=更新，隐藏=潜意识\n\n' +
      '3) 艺术与文学：\n' +
      '- 诱惑（夏娃、克娄巴特拉）、力量与禁忌\n' +
      '- 现代奇幻/科幻：混合“危险 + 智慧”的角色原型\n\n' +
      '4) 现代语境：\n' +
      '- 医疗标识、制药 logo（治愈/控制毒性）\n' +
      '- 流行文化：酷炫、神秘、反叛符号；“Snake Eyes” 等角色\n\n' +
      '5) 视觉元素与配色：\n' +
      '- 形状：S 曲线、盘绕、蛇纹图腾\n' +
      '- 颜色：绿/金=生命与神圣，黑/红=危险与禁忌\n\n' +
      '如果需要，我可以展开其中任意部分或写成完整文章。',
    timestamp: new Date('2024-08-19T09:01:00Z'),
  },
  {
    role: 'user',
    content: '把第 2 部分写成 150 字的描述，语气冷静一点。',
    timestamp: new Date('2024-08-19T09:03:00Z'),
  },
  {
    role: 'assistant',
    content:
      '在心理学语境里，蛇常被视为潜意识能量的化身。荣格认为它代表人类内心深处的阴影：既蕴含欲望，也藏着恐惧；它的潜行与突袭象征被压抑的情绪，会在意想不到的时刻浮现。蛇蜕皮的过程像是内在转化——旧经验与身份被剥离，新生的自我露出。它既是威胁，也提醒人们：面对恐惧与未知，才能完成自我更新。',
    timestamp: new Date('2024-08-19T09:04:30Z'),
  },
];

export const chatgptConversations: ChatGPTConversation[] = [
  {
    id: 'new-conversation',
    title: '新对话',
    createdAt: new Date('2024-09-01T08:00:00Z'),
    messages: [],
  },
  {
    id: 'snake-symbolism',
    title: 'Snake symbolism analysis',
    createdAt: new Date('2024-08-19T09:00:00Z'),
    messages: snakeMessages,
  },
];
