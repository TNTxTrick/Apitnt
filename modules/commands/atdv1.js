module.exports.config = {
 name: "testt",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Vtuan",
 description: "down",
 commandCategory: "Nhóm",
 usages: "",
 cooldowns: 5
 };
 
 const axios = require('axios');
 const fs = require('fs');
 const path = require('path');
 const isURL = u => /^http(|s):\/\//.test(u);

 
 const supportedPlatforms = [
 { regex: /(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//, fileType: 'mp4', cacheIndex: 0 },
 { regex: /(^https:\/\/)(\w+\.)?(facebook|fb)\.(com|watch|reel)\/\w+\/\w?(\/)?/, fileType: 'mp4', cacheIndex: 2 },
 { regex: /http(s|):\/\/(www\.)?instagram\.com\/(reel|p)\/\w+/, fileType: 'jpg', cacheIndex: 3 },
 { regex: /^(https?:\/\/)?(www.)?(m\.)?(mp3|zing)mp3\.vn\/bai-hat\/[\w\-\.]+\/\w+/, fileType: 'mp3', cacheIndex: 4 },
 { regex: /^(https?:\/\/)?(www.)?(m\.)?soundcloud\.com\/[\w\-\.]+(\/)+[\w\-\.]+/, fileType: 'mp3', cacheIndex: 5 }
 ];
 
 exports.handleEvent = async function(o) {
 try {
 const str = o.event.body;
 const send = msg => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
 
 if (isURL(str)) {
 const platform = supportedPlatforms.find(platform => platform.regex.test(str));
 if (platform) {
 const res = await axios.get(`https://thenamk3.net/api/autolink.json?link=${str}&apikey=NemG_RdWCWGCW`);
 const stream = (await axios.get(res.data.videos[0].url, { responseType: "arraybuffer" })).data;
 
 const extension = platform.fileType;
 const cacheIndex = platform.cacheIndex;
 const filePath = path.join(__dirname, `/cache/${cacheIndex}.${extension}`);
 
 fs.writeFileSync(filePath, Buffer.from(stream, "utf-8"));
 send({ body: `${res.data.videos[0].title}`, attachment: fs.createReadStream(filePath) })
 }
 }
 } catch (e) {
 console.log('Error', e);
 }
 };
 module.exports.run = async ({ api, event, args, Threads }) => {}