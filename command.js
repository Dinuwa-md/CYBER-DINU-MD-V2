const { config } = require('./config');

module.exports = {
    async dinuCommand(sock, sender) {
        const message = 'Goodbye! Leaving the group...';
        await sock.sendMessage(sender, { text: message });

        // Send group link and channel link details
        const groupLink = config.whatsappGroupLink;
        const channelLink = config.whatsappChannelLink;
        
        const groupAndChannelMessage = `Here are the links:\n\nGroup Link: ${groupLink}\nChannel Link: ${channelLink}`;
        await sock.sendMessage(sender, { text: groupAndChannelMessage });

        // Auto leave group and delete messages feature
        try {
            await sock.groupRemove(config.groupId, [sender]);  // Bot leaves the group
            console.log(`User ${sender} removed from group ${config.groupId}`);
        } catch (error) {
            console.error('Error leaving group:', error);
        }

        console.log('.DINU command executed by', sender);
    },

    async statusCommands(sock, sender, messageContent) {
        if (messageContent.toLowerCase() === '.stutasreact') {
            await sock.sendMessage(sender, { text: 'Status Reacting...' });
        } else if (messageContent.toLowerCase() === '.statusseen') {
            await sock.sendMessage(sender, { text: 'STATUS SEEN BY CYBER DINU MD' });
        } else if (messageContent.toLowerCase() === '.stutasreply') {
            await sock.sendMessage(sender, { text: 'Auto Status Reply Activated' });
        }
    }
};
