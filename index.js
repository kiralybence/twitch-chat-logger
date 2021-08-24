const tmi = require('tmi.js')
const fs = require('fs')

const client = new tmi.client({
    connection: {
        reconnect: true,
    },
    channels: getChannels(),
})

client.connect()

let queue = {}

client.on('message', (channel, tags, message, self) => {
    const datetime = new Date(parseInt(tags['tmi-sent-ts'])).toISOString()
    const date = datetime.slice(0, 10)
    const time = datetime.slice(11, 19)

    if (!queue[channel]) {
        queue[channel] = {}
    }

    if (!queue[channel][date]) {
        queue[channel][date] = []
    }

    // TODO: escape \n (and other stuff) in messages
    queue[channel][date].push(`[${time}] ${tags['display-name']}: ${message}\n`)
})

setInterval(() => {
    for (const [channel, dates] of Object.entries(queue)) {
        for (const [date, messages] of Object.entries(dates)) {
            const logDir = `./logs/${channel}`

            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true })
            }

            fs.appendFileSync(`${logDir}/${date}.txt`, messages.join(''))

            delete queue[channel][date]
        }
    }
}, 10000)

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