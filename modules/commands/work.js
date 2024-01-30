const axios = require('axios');
const { stream_url } = require('./utils'); // assume utils contains stream_url function

let works = {
    '😠': { name: 'câu cá', img: 'https://i.imgur.com/DoB5Cw8.gif', ... },
    '❤': { name: 'săn thú hoang', img: 'https://i.imgur.com/jc2j4ps.gif', ... },
    '😢': { name: 'Đào đá', img: 'https://i.imgur.com/zBWwXzN.gif', ... },
    '👍': { name: 'bắn chim', img: 'https://i.imgur.com/4DctekU.gif', ... },
    // add more tasks...
};

exports.config = {
    name: 'works',
    version: '0.0.1',
    hasPermission: 0,
    credits: 'DC-Nam',
    description: 'work',
    commandCategory: 'Kiếm tiền',
    usages: '[]',
    cooldowns: 3
};

exports.run = ({ api, event, Users, Currencies }) => {
    const user = Users.getData(event.userID);
    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);

    if (!user || user.data.work >= Date.now()) return send('Hãy làm việc sau ít phút nữa.');

    const tasksList = Object.entries(works).map(([emoji, task], index) => `[${index + 1} / ${emoji}] ${task.name}`).join('\n');
    send(`[Công việc]\n${tasksList}\n\nChọn emoji để làm việc tương ứng hoặc reply số thứ tự.`);
};

exports.handleReaction = async ({ handleReaction, event, Users, api, Currencies }) => {
    const { event: { senderID, userID, reaction } } = handleReaction;
    const user = await Users.getData(userID);
    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);

    if (!user || user.data.work >= Date.now() || senderID !== userID) return;

    const work = works[reaction];
    if (!work) return send('Công việc không có trong danh sách.');

    user.data.work = Date.now() + 1000 * 60 * 5;
    Users.setData(userID, user);

    const workMessage = await send({ body: `Đang ${work.name}...`, attachment: work.img ? await stream_url(work.img) : [] });

    await new Promise((resolve) => setTimeout(resolve, 1000 * 3.5));

    const doneTask = work.done[Math.floor(Math.random() * work.done.length)];
    const earnedMoney = Math.floor(Math.random() * (100000 - 20000 + 1) + 20000);

    const messageBody = doneTask[0].replace(/{name}/g, user.name).replace(/{money}/g, earnedMoney);
    const message = { body: messageBody };

    if (doneTask[1]) {
        message.attachment = await stream_url(doneTask[1]);
    }

    send(message, () => api.unsendMessage(workMessage.messageID));
    Currencies.increaseMoney(userID, earnedMoney);
};
