import WebSocket from 'ws'
import { Message } from './message'

require('dotenv').config()

const ws = new WebSocket(process.env.WS_URL ?? 'ws://localhost:8080')

const stringifyMessage = (message: Message): string => {
    return JSON.stringify(message.toJSON())
}

const sendMessage = (message: Message): void => {
    ws.send(stringifyMessage(message))
}

const sendStringMessage = (message: string) => {
    sendMessage(new Message({message}))
}

ws.on('open', function open() {
    sendStringMessage(`Hello! I am ${Message.ME} :) You can talk to me by mentionning me @${Message.ME}.`)
})

const alreadyTalked = new Set<string>()
const reactions = ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘']

ws.on('message', function message(data) {
    console.log('received: %s', data)
    try {
        const stringData = data.toString()
        const message: Message = new Message(JSON.parse(stringData))
        if (message.message === 'Connected') {
            setTimeout(() => sendStringMessage(`Welcome! I am ${Message.ME} :) You can talk to me by mentionning me @${Message.ME}.`) ,1500)
        }
        
        if (message.message.toLowerCase().includes(Message.ME.toLowerCase())) {
            if (alreadyTalked.size > 20) alreadyTalked.clear()
            if (!alreadyTalked.has(message.color)) {
                alreadyTalked.add(message.color)
                sendStringMessage('Hey! I see you are trying to communicate with me. I cannot communicate yet, but I will be able to soon! :)')
            } else {
                sendStringMessage(reactions[Math.floor(Math.random()*reactions.length)])
            }
        }
    } catch (e) {
        console.error(e)
        sendStringMessage('Sorry, I got an error.')
    }
})
