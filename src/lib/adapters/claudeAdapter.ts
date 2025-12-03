import { ClaudeAppData, ClaudeConversation, ClaudeMessage } from "@/types";

// Mock data for now
export const MOCK_CONVERSATION: ClaudeConversation = {
  uuid: "123",
  name: "Project Brainstorming",
  created_at: "2023-10-27T10:00:00Z",
  updated_at: "2023-10-27T10:05:00Z",
  chat_messages: [
    {
      uuid: "m1",
      text: "I have a new idea for a website. It's a digital desktop.",
      sender: "human",
      created_at: "2023-10-27T10:00:00Z",
      updated_at: "2023-10-27T10:00:00Z"
    },
    {
      uuid: "m2",
      text: "That sounds fascinating! A digital desktop interface for a personal website is a great way to showcase your work in a unique, interactive format. \n\nWhat kind of features are you thinking of including?",
      sender: "assistant",
      created_at: "2023-10-27T10:00:30Z",
      updated_at: "2023-10-27T10:00:30Z"
    },
    {
      uuid: "m3",
      text: "I want it to look like Windows 11. With draggable windows and a taskbar.",
      sender: "human",
      created_at: "2023-10-27T10:01:00Z",
      updated_at: "2023-10-27T10:01:00Z"
    }
  ]
};

export async function getClaudeConversation(id: string): Promise<ClaudeConversation> {
  // In the future, this could fetch from an API or read a local file
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CONVERSATION), 500);
  });
}
