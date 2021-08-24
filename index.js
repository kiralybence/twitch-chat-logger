const tmi = require('tmi.js')
const fs = require('fs')

const client = new tmi.client({
    connection: {
        reconnect: true,
    },
    channels: getChannels(),
})

client.connect()

client.on('message', (channel, tags, message, self) => {
    const timestamp = new Date(parseInt(tags['tmi-sent-ts'])).toISOString()
    const date = timestamp.slice(0, 10)
    const time = timestamp.slice(11, 19)
    const logDir = `./logs/${channel}`

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
    }

    fs.appendFileSync(
        `${logDir}/${date}.txt`,
        `[${time}] ${tags['display-name']}: ${message}\n`
    )
})

function getChannels() {
    const channelPath = './channels.txt'

    if (!fs.existsSync(channelPath)) {
        fs.writeFileSync(channelPath, '')
        return []
    }

    return fs.readFileSync(channelPath, { encoding: 'utf8', flag: 'r' })
        .replace(/\r\n/g,'\n')
        .split('\n')
        .filter(channel => channel)
        .map(channel => '#' + channel.trim())
}