const { makeWASocket, useMultiFileAuthState } = require('@adiwajshing/baileys');
const { dinuCommand, statusCommands, autoJoinCommands } = require('./commands');
const { config } = require('./config');

const startBot = async () => {
    const { state, saveState } = await useMultiFileAuthState('./auth');
    const sock = makeWASocket({ auth: state });

    sock.ev.on('messages.upsert', async (messageUpdate) => {
        const message = messageUpdate.messages[0];
        const sender = message.key.remoteJid;

        if (message.key.fromMe) return;

        const messageContent = message.message.conversation;
        
        if (messageContent.toLowerCase() === '.dinu') {
            await dinuCommand(sock, sender);
        }

        // Handle other status commands
        await statusCommands(sock, sender, messageContent);
    });

    // Auto add to WhatsApp Group and Channel
    await autoJoinCommands(sock);

    console.log('WhatsApp Bot started successfully!');
};

// Function to auto join WhatsApp group and channel
const autoJoinCommands = async (sock) => {
    const groupLink = config.whatsappGroupLink;
    await sock.groupInviteAccept(groupLink);  // Join the WhatsApp group

    const channelLink = config.whatsappChannelLink;
    console.log(`Bot joined group: ${groupLink}`);
    console.log(`Bot joined channel: ${channelLink}`);
};

startBot();
