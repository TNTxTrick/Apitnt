const axios = require('axios');

module.exports = {
  config: {
    name: 'catbox',
    commandCategory: 'Tiện ích',
    hasPermission: 0,
    credits: 'Lê Minh Tiến',//chatgpt
    usages: 'chuyển ảnh, video, gif sang link catbox',
    description: 'Chuyển ảnh, video, gif sang link catbox',
    cooldowns: 0
  },
  run: async (o) => {
    const send = (msg) => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
    let msg = '';

    if (o.event.type !== "message_reply") {
      return send("⚠️ Hình ảnh không hợp lệ, vui lòng phản hồi một video, ảnh nào đó");
    }

    for (let i of o.event.messageReply.attachments) {
      // Kiểm tra loại tệp có phải là ảnh, video, hay gif không
      if (i.type !== "photo" && i.type !== "video" && i.type !== "animated_image") {
        return send("⚠️ Loại tệp không hợp lệ. Chỉ chấp nhận ảnh, video, hoặc gif.");
      }

      await axios.get(`https://catbox.moe/user/api?url=${encodeURIComponent(i.url)}`).then(async ($) => {
        msg += `"${$.data.url}",\n`;
      }).catch((error) => {
        // Xử lý lỗi từ Catbox API và thông báo cho người dùng
        console.error('Lỗi khi chuyển đổi tệp sang Catbox:', error);
        return send("⚠️ Đã xảy ra lỗi khi chuyển đổi tệp sang Catbox.");
      });
    }

    // Gửi liên kết Catbox
    return send(msg);
  }
};
