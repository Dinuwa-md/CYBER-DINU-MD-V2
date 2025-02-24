const { exec } = require("child_process");
const ytdl = require("ytdl-core");
const fs = require("fs");
const config = require("./config");

module.exports = async function (text, sender, sock) {
    // Support & Channel Links
    if (text.startsWith(".support")) {
        await sock.sendMessage(sender, { text: `Join our Support Group: ${config.supportGroupLink}` });
    }

    if (text.startsWith(".channel")) {
        await sock.sendMessage(sender, { text: `Join our WhatsApp Channel: ${config.channelLink}` });
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

    // .DINU Command
    if (text.startsWith(".DINU")) {
        const userInfo = {
            Name: "CYBER DINU ID",
            Age: "17",
            From: "Bandarawela",
            Gender: "Girl"
        };

        let responseMessage = `Name: ${userInfo.Name}\n`;
        responseMessage += `ID: ${userInfo.ID}\n`;
        responseMessage += `Age: ${userInfo.Age}\n`;
        responseMessage += `From: ${userInfo.From}\n`;
        responseMessage += `Gender: ${userInfo.Gender}\n`;

        await sock.sendMessage(sender, { text: responseMessage });
    }

    // Fake Recording
    if (text.startsWith(".fakeRecording")) {
        await sock.sendMessage(sender, { text: "Fake Recording Started..." });
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

    // Status Seen (Auto Seen)
    if (text.startsWith(".status")) {
        await sock.sendMessage(sender, { text: "☠️ Status Seen by CYBER DINU MD ☠️" });
    }
};
