const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const ytdl = require("ytdl-core");
const fs = require("fs");
const { exec } = require("child_process");
const config = require("./config");

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

        // Call Commands from commands.js
        require("./commands")(text, sender, sock);
    });
}

startBot();
