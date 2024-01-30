module.exports.config = {
  name: "kickndfb",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "tnt",
  description: "Lọc người dùng Facebook",
  commandCategory: "Quản Lí Box",
  usages: "kickndfb",
  cooldowns: 20
};

module.exports.run = async function ({ api, event }) {
  const { userInfo, adminIDs } = await api.getThreadInfo(event.threadID);
  let success = 0, fail = 0;
  const fbUsers = userInfo.filter(e => e.gender === undefined).map(e => e.id);
  const isBotAdmin = adminIDs.some(e => e.id === api.getCurrentUserID());

  if (fbUsers.length === 0) {
    return api.sendMessage("Trong nhóm bạn không tồn tại 'Người dùng Facebook'.", event.threadID);
  } else {
    api.sendMessage(`Nhóm bạn hiện có ${fbUsers.length} 'Người dùng Facebook'.`, event.threadID, () => {
      if (!isBotAdmin) {
        api.sendMessage("Nhưng bot không phải là quản trị viên nên không thể lọc được.", event.threadID);
      } else {
        api.sendMessage("Bắt đầu lọc..", event.threadID, async () => {
          for (const userId of fbUsers) {
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              await api.removeUserFromGroup(parseInt(userId), event.threadID);
              success++;
            } catch {
              fail++;
            }
          }

          api.sendMessage(`Đã lọc thành công ${success} người. ${fail !== 0 ? `Lọc thất bại ${fail} người.` : ''}`, event.threadID);
        });
      }
    });
  }
};
