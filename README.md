# Twitch Chat Logger

A simple script that logs Twitch chat messages to `.txt` files.

## Installation

### Prerequisites
- Node v12+

### Setup
- Install npm packages
```bash
npm install
```

- Create a `channels.txt` file with the channels you want to log (1 channel/row)
```
channel1
channel2
channel3
```

- Start the logger
```bash
npm start
```

- The logs will be saved to the `logs` directory, with the according channel names and dates (in UTC)