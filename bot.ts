import WebSocket from 'ws'
import { Message } from './message'
require('dotenv').config()
import { chat } from './ai'
import { welcomeMessage } from './ai-chat-history'

const ws = new WebSocket(process.env.WS_URL ?? 'ws://localhost:8080')

const stringifyMessage = (message: Message): string => {
    return JSON.stringify(message.toJSON())
}

const sendMessage = (message: Message): void => {
    ws.send(stringifyMessage(message))
}

const sendStringMessage = (message: string) => {
    sendMessage(new Message({ message }))
}

ws.on('open', function open() {
    sendStringMessage(`Hello! I am ${Message.ME} :) You can talk to me by mentionning me @${Message.ME}.`)
})

ws.on('message', async function message(data) {
    console.log('received: %s', data)
    try {
        const stringData = data.toString()
        const message: Message = new Message(JSON.parse(stringData))
        if (message.message === 'Connected') {
            sendStringMessage(welcomeMessage)
        }

        if (message.message.toLowerCase().includes(Message.ME.toLowerCase())) {
            const answer = await chat(message)
            sendStringMessage(answer)
        }
    } catch (e) {
        console.error(e)
        sendStringMessage('Sorry, I got an error.')
    }
})
