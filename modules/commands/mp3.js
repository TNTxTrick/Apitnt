const axios = require('axios');
const request = require('request');
const fs = require('fs');

module.exports.config = {
  name: "mp3",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "tnt",
  description: "nhạc",
  commandCategory: "mp3",
  usages: "",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  const rdPathName = Math.floor(Math.random() * 99999999999999);

  const downloadMP3 = async (url, path) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(path, Buffer.from(response.data, 'binary'));
  };

  if (event.attachments[0].type === 'audio') {
    const path = __dirname + `/sendmsg/${rdPathName}.mp3`;
    await downloadMP3(event.attachments[0].url, path);
  }

  const getdata = (await axios.get(event.attachments[0].url, { responseType: 'arraybuffer' })).data;
  const path = __dirname + `/sendmsg/${rdPathName}.mp3`;
  fs.writeFileSync(path, Buffer.from(getdata, 'binary'));

  let callback = function () {
    api.sendMessage({
      body: ``,
    });
  };

  const mp3Url = (await axios.get('https://736d4ec6-134f-49d0-b89e-2ed89e6b1c6d-00-3fmflttuj7k7a.worf.replit.dev/images/mp3')).data.url;

  if (mp3Url) {
    const mp3Path = __dirname + `/sendmsg/${rdPathName}.mp3`;
    await downloadMP3(mp3Url, mp3Path);
    request(mp3Url).pipe(fs.createWriteStream(__dirname + `/cache/dạ.${ext}`)).on("close", callback);
  }
};
