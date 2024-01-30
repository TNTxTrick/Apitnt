module.exports.config = {
  name: "gái",
  version: "1.1.2",
  hasPermission: 0,
  credits: "JRT",
  description: "Random ảnh gái",
  commandCategory: "random-img",
  usages: "gái",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");

  try {
    const response = await axios.get('https://raw.githubusercontent.com/TNTxTrick/api/mainV2/gai.json');
    const imageUrl = response.data.data;

    const callback = function () {
      api.sendMessage({
        body: "Đây là ảnh gái ngẫu nhiên:",
        attachment: fs.createReadStream(__dirname + '/cache/gaidep.jpg')
      }, event.threadID, () => fs.unlinkSync(__dirname + '/cache/gaidep.jpg'), event.messageID);
    };

    request(imageUrl).pipe(fs.createWriteStream(__dirname + '/cache/gaidep.jpg')).on("close", callback);
  } catch (error) {
    console.error('Lỗi khi tải ảnh gái:', error);
    api.sendMessage('⚠️ Đã xảy ra lỗi khi tải ảnh gái.', event.threadID);
  }
};
