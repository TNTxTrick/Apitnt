const axios = require('axios');
const downloader = require('image-downloader');
const fse = require('fs-extra');
const path = __dirname + '/cache/statusAuto.json';

function streamURL(url, mime) {
    const dest = `${__dirname}/cache/${Date.now()}.${mime}`;
    downloader.image({ url, dest });
    setTimeout(() => fse.unlinkSync(dest), 60 * 1000);
    return fse.createReadStream(dest);
}

function onLoad() {
    if (!fse.existsSync(path)) fse.writeFileSync(path, '{}');
}

async function noprefix(arg) {
    const s = JSON.parse(fse.readFileSync(path));
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss (D/MM/YYYY) (dddd)");
    if (arg.event.senderID == (global.botID || arg.api.getCurrentUserID()) || (typeof s[arg.event.threadID] == 'boolean' && !s[arg.event.threadID])) return;

    const out = (a, b, c, d) => arg.api.sendMessage(a, b || arg.event.threadID, c || null, d || arg.event.messageID);
    const arr = arg.event.args;
    const regEx_instagram = /^\u0068\u0074\u0074\u0070\u0073\u003a\/\/(www\.)?instagram\.com\/(reel|p)\/\w*/;

    for (const el of arr) {
        
      if (regEx_instagram.test(el)) {
      try {
          const idl = (await axios.get(`https://736d4ec6-134f-49d0-b89e-2ed89e6b1c6d-00-3fmflttuj7k7a.worf.replit.dev/instagram/downloadpost?url=${el}`)).data;
          const attachment = await streamURL(idl.video_url ? idl.video_url : idl.display_url, idl.video_url ? 'mp4' : 'jpg');
          const body = !idl.video_url ? '👍' : '';
          out({ attachment, body });
          if (!idl.video_url) {
              global.client.handleReaction.push({ name: configCommand.name, messageID: dataMsg.messageID, url: idl.video_url });
          }
      } catch (error) {
          console.error(error);
      }
    }    
    }
}

async function reactionMsg(arg) {
    if (arg.event.reaction == '👍') {
        const out = (a, b, c, d) => arg.api.sendMessage(a, b || arg.event.threadID, c || null, d);
        const _ = arg.handleReaction;
        if ('url' in _) out({
            body: `MP3`, attachment: await streamURL(_.url, 'mp3')
        });
    }
}

function runCommand(arg) {
    const out = (a, b, c, d) => arg.api.sendMessage(a, b || arg.event.threadID, c || null, d || arg.event.messageID);
    const data = JSON.parse(fse.readFileSync(path));
    const s = data[arg.event.threadID] = typeof data[arg.event.threadID] !== 'boolean' || !!data[arg.event.threadID] ? false : true;
    fse.writeFileSync(path, JSON.stringify(data, 0, 4));
    out((s ? '→ bật' : '→ tắt') + ' ' + configCommand.name);
}

const configCommand = {
    name: 'atd',
    version: '1.1.0',
    hasPermssion: 2,
    credits: 'tnt',
    description: 'Down ig',
    commandCategory: 'Ig',
    usages: '[]',
    cooldowns: 3
};

module.exports = {
    config: configCommand,
    onLoad,
    run: runCommand,
    handleEvent: noprefix,
    handleReaction: reactionMsg
};
