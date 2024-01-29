import axios from 'axios'
import { Message } from './message'
import { AiChatHistory, AiMessage } from './ai-chat-history'

const apiKey = process.env.AI_KEY

const getChatCompletions = async (model: string, messages: AiMessage[]) => {
    const url = 'https://api.mistral.ai/v1/chat/completions'
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
    }
    const data = {
        model,
        messages
    }

    try {
        const response = await axios.post(url, data, { headers })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

const fullChatHistory = new AiChatHistory()

export async function chat(message: Message): Promise<string> {
    const chatHistory = fullChatHistory.addMessage(message.color, { role: 'user', content: message.message })
    const chatResponse = await getChatCompletions('mistral-tiny', chatHistory)
    const response = chatResponse.choices[0].message
    fullChatHistory.addMessage(message.color, response)
    return response.content
}
