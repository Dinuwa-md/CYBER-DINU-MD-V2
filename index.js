const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const ytdl = require("ytdl-core");
const play = require("play-dl");
const axios = require("axios");
const fs = require("fs");
const { exec } = require("child_process");

const supportGroupLink = "https://chat.whatsapp.com/your-group-link";  // Change this with your support group link
const channelLink = "https://wa.me/your-channel-link";  // Change this with your WhatsApp channel link

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", (update) => {
        const { connection } = update;
        if (connection === "open") console.log("WhatsApp Bot Connected!");
        if (connection === "close") startBot();
    });

    sock.ev.on("messages.upsert", async (msg) => {
        const message = msg.messages[0];
        if (!message.message || message.key.fromMe) return;

        const sender = message.key.remoteJid;
        const text = message.message.conversation || message.message.extendedTextMessage?.text || "";

        // Auto-reply with Group and Channel Links
        if (text.startsWith(".support")) {
            await sock.sendMessage(sender, { text: `Join our Support Group: ${supportGroupLink}` });
        }

        if (text.startsWith(".channel")) {
            await sock.sendMessage(sender, { text: `Join our WhatsApp Channel: ${channelLink}` });
        }

        // YouTube Download - MP3
        if (text.startsWith("!ytmp3 ")) {
            let url = text.split(" ")[1];
            let info = await ytdl.getInfo(url);
            let title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
            let filePath = `./${title}.mp3`;

            let stream = ytdl(url, { filter: "audioonly" });
            stream.pipe(fs.createWriteStream(filePath)).on("finish", async () => {
                await sock.sendMessage(sender, { document: fs.readFileSync(filePath), mimetype: "audio/mpeg", fileName: `${title}.mp3` });
                fs.unlinkSync(filePath);
            });
        }

        // YouTube Download - MP4
        if (text.startsWith("!ytmp4 ")) {
            let url = text.split(" ")[1];
            let info = await ytdl.getInfo(url);
            let title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
            let filePath = `./${title}.mp4`;

            let stream = ytdl(url, { quality: "highestvideo" });
            stream.pipe(fs.createWriteStream(filePath)).on("finish", async () => {
                await sock.sendMessage(sender, { document: fs.readFileSync(filePath), mimetype: "video/mp4", fileName: `${title}.mp4` });
                fs.unlinkSync(filePath);
            });
        }

        // Fake Recording
        if (text.startsWith(".fakeRecording")) {
            await sock.sendMessage(sender, { text: "Fake Recording Started..." });
            // Simulate fake recording here (you can send a "recording" message or something like that)
        }

        // .ping Command
        if (text.startsWith(".ping")) {
            await sock.sendMessage(sender, { text: "Pong! 🏓" });
        }

        // .menu Command
        if (text.startsWith(".menu")) {
            await sock.sendMessage(sender, {
                text: `Available Commands:\n\n.ping - Check bot status\n.support - Get support group link\n.channel - Get WhatsApp channel link\n!ytmp3 [YouTube URL] - Download MP3\n!ytmp4 [YouTube URL] - Download MP4\n.fakeRecording - Start fake recording`,
            });
        }

        // .settings Command (Button-based UI)
        if (text.startsWith(".settings")) {
            const buttons = [
                { buttonId: '.support', buttonText: { displayText: 'Support Group' }, type: 1 },
                { buttonId: '.channel', buttonText: { displayText: 'WhatsApp Channel' }, type: 1 },
            ];
            const buttonMessage = {
                text: "Click a button below:",
                buttons: buttons,
                footer: "Cyber Dinu Bot",
            };
            await sock.sendMessage(sender, buttonMessage);
        }
    });
}

startBot();
