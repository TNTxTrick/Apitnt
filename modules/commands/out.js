module.exports.config = {
  name: "out",
  version: "1.0.1",
  hasPermission: 2, // Kiểm tra và đặt quyền hạn phù hợp
  credits: "tnt",
  description: "Rời khỏi nhóm",
  commandCategory: "Hệ thống",
  usages: "[tid]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const threadID = args[0] ? parseInt(args[0]) : event.threadID;

  try {
    // Kiểm tra xem nhóm có tồn tại không
    const threadInfo = await api.getThreadInfo(threadID);
    if (!threadInfo) {
      return api.sendMessage('Nhóm không tồn tại hoặc bot không có quyền truy cập.', event.threadID);
    }

    // Thực hiện lệnh out
    await api.removeUserFromGroup(api.getCurrentUserID(), threadID);

    // Thông báo cho người dùng
    return api.sendMessage('Đã rời khỏi nhóm thành công!', threadID);
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh out:', error);
    return api.sendMessage('Đã xảy ra lỗi khi thực hiện lệnh out.', event.threadID);
  }
};
