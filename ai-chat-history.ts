import { Message } from './message'

export type AiMessage = {
    role: 'user' | 'system' | 'assistant'
    content: string
}

export const welcomeMessage = `Welcome! I am ${Message.ME} :) You can talk to me by mentionning me @${Message.ME}.`

const initialMessages: AiMessage[] = [
    { role: 'user', content: 'Hi.' },
    { role: 'assistant', content: welcomeMessage }
]

export class AiChatHistory {
    chatHistory: Record<string, AiMessage[]> = {}

    constructor(chatHistory?: Record<string, AiMessage[]>) {
        if (chatHistory && Object.keys(chatHistory).length) {
            this.chatHistory = chatHistory
        } else {
            chatHistory = {}
        }
    }

    addMessage(color: string, message: AiMessage): AiMessage[] {
        if (!Array.isArray(this.chatHistory[color])) {
            this.chatHistory[color] = [...initialMessages]
        }
        this.chatHistory[color].push(message)
        return this.getHistory(color)
    }

    getHistory(color: string): AiMessage[] {
        return this.chatHistory[color]
    }

    clearHistory(color: string): number {
        if (!Array.isArray(this.chatHistory[color])) return 0
        const deleted = this.chatHistory[color].length
        delete this.chatHistory[color]
        return deleted
    }
}
