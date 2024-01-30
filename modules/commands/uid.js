module.exports.config = {
    name: "uid",
    version: "1.0.1",
    hasPermission: 0,
    credits: "",
    description: "Kiểm tra uid acc fb",
    commandCategory: "Công cụ",
    usages: "uid [UID]/ uid [link profile]/ uid [mention]",
    cooldowns: 5
};

const axios = require('axios');

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;

    if (!args[0]) {
        return api.sendMessage('Vui lòng cung cấp UID, link profile hoặc đề cập người dùng.', threadID, messageID);
    }

    let uid;

    if (args[0].startsWith('https://')) {
        const link = args[0];
        try {
            const response = await axios.get(`https://api.zeidbot.site/timuid?link=${encodeURIComponent(link)}`);
            uid = response.data.id;
        } catch (error) {
module.exports.run = () => {};        }
    } else {
        uid = args[0];
    }

    if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
    }

    if (args.join().indexOf("@") !== -1) {
        uid = Object.keys(event.mentions)[0];
    }

    api.sendMessage(`UID của người dùng là: ${uid}`, threadID, messageID);
};
