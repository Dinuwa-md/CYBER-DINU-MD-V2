# WhatsApp Bot

This is a simple WhatsApp Bot built with Baileys library for handling various functionalities such as YouTube downloads, auto-replies, fake recordings, etc.

## Features
- Auto-reply with Group and Channel Links
- YouTube Video/Audio Downloads (MP4/MP3)
- Fake Recording
- Status Seen
- Button-based UI for settings and commands

## Setup
1. Clone this repository.
2. Install dependencies using `npm install`.
3. Update the `config.js` file with your **support group** and **channel** links.
4. Run the bot using `node index.js`.

## Deploy
This bot can be deployed on platforms like **Heroku** or **Railway**.

## Commands
- `.support`: Get support group link.
- `.channel`: Get WhatsApp channel link.
- `!ytmp3 [YouTube URL]`: Download audio (MP3) from YouTube.
- `!ytmp4 [YouTube URL]`: Download video (MP4) from YouTube.
- `.fakeRecording`: Start fake recording.
- `.ping`: Check bot status.
- `.menu`: Get list of available commands.
- `.settings`: Get button-based UI for commands.
- `.DINU`: Get user information (name, age, etc.).
- `.status`: Simulate status view (Auto Seen).
